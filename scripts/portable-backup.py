"""Create a local, verified portable ZIP. Requires Python 3 and Git; never changes source files."""
import hashlib
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {'node_modules', 'dist', 'dist-ssr', '.cache', '.vite', '__pycache__', 'coverage', '.aws', '.ssh', '.codex', '.agents'}
PATTERN = re.compile(rb'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[A-Z0-9]{16}|https?://[^\s/:]+:[^\s/@]+@')

def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args])

def safe_bytes(data, label):
    if PATTERN.search(data):
        raise ValueError('Possible credential detected; review locally: ' + label)

def main():
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 scripts/portable-backup.py /absolute/path/backup.zip')
    target = Path(sys.argv[1]).expanduser().resolve()
    if target.is_relative_to(ROOT):
        raise ValueError('Choose a destination outside the project.')
    if not (ROOT / '.git').is_dir() or (ROOT / '.git/objects/info/alternates').exists():
        raise ValueError('A standalone Git repository is required.')
    # Check reachable historical blobs too; never print matching secret values.
    for row in git('rev-list', '--objects', '--all').decode().splitlines():
        oid = row.split(' ', 1)[0]
        if git('cat-file', '-t', oid).strip() == b'blob':
            safe_bytes(git('cat-file', 'blob', oid), 'Git blob ' + oid)
    entries, excluded = {}, []
    for path in sorted(ROOT.rglob('*')):
        relative = path.relative_to(ROOT)
        parts = relative.parts
        if any(part in SKIP_DIRS for part in parts):
            continue
        name = path.name
        if path.is_dir():
            continue
        if (name.startswith('.env') or name in {'.npmrc', '.DS_Store'} or
                name.endswith(('.log', '.pem', '.key', '.p12', '.pfx', '.zip')) or
                parts[:2] in {('.git', 'hooks'), ('.git', 'gk')} or
                relative.as_posix() in {'.git/FETCH_HEAD', '.git/COMMIT_EDITMSG'}):
            excluded.append(relative.as_posix())
            continue
        if path.is_symlink():
            raise ValueError('Review symlink before backup: ' + relative.as_posix())
        data = path.read_bytes()
        if relative.as_posix() == '.git/config':
            data = b'[core]\n\trepositoryformatversion = 0\n\tfilemode = false\n\tbare = false\n\tlogallrefupdates = true\n'
        if parts[0] != '.git' or parts[1] != 'objects':
            safe_bytes(data, relative.as_posix())
        entries[relative.as_posix()] = data
    manifest = {
        'head': git('rev-parse', 'HEAD').decode().strip(),
        'status': git('status', '--porcelain=v1', '--untracked-files=all').decode(),
        'files': {name: hashlib.sha256(data).hexdigest() for name, data in entries.items()},
        'excludedFiles': excluded, 'excludedDirectories': sorted(SKIP_DIRS),
        'note': 'Archive-only Git config removes remotes and machine settings. Hooks excluded. Recognizable credential patterns checked, not a guarantee against every secret format.'
    }
    prefix = ROOT.name + '/'
    with zipfile.ZipFile(target, 'x', zipfile.ZIP_DEFLATED) as archive:
        for name, data in entries.items():
            archive.writestr(prefix + name, data)
        archive.writestr(prefix + 'PORTABLE-BACKUP-MANIFEST.json', json.dumps(manifest, indent=2) + '\n')
    with zipfile.ZipFile(target) as archive:
        assert archive.testzip() is None
        for name, digest in manifest['files'].items():
            assert hashlib.sha256(archive.read(prefix + name)).hexdigest() == digest
    print(f'Verified {len(entries)} files, ZIP CRC and SHA-256 manifest: {target}')
    print('Archive SHA-256: ' + hashlib.sha256(target.read_bytes()).hexdigest())

if __name__ == '__main__':
    main()
