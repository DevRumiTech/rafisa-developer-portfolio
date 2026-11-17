"""Read-only ZIP verification; works on macOS and Windows with Python 3."""
import hashlib
import json
import sys
import zipfile
from pathlib import PurePosixPath


def verify(path):
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        if len(names) != len(set(names)):
            raise ValueError('Duplicate archive paths')
        for name in names:
            parts = PurePosixPath(name).parts
            if name.startswith('/') or '\\' in name or '..' in parts or ':' in name:
                raise ValueError('Unsafe archive path')
        manifests = [name for name in names if name.endswith('/PORTABLE-BACKUP-MANIFEST.json')]
        if len(manifests) != 1:
            raise ValueError('Exactly one portable manifest required')
        manifest_name = manifests[0]
        prefix = manifest_name.rsplit('/', 1)[0] + '/'
        manifest = json.loads(archive.read(manifest_name))
        expected = {prefix + name for name in manifest['files']}
        if set(names) != expected | {manifest_name}:
            raise ValueError('Archive file list differs from manifest')
        if archive.testzip() is not None:
            raise ValueError('ZIP CRC failure')
        for name, digest in manifest['files'].items():
            if hashlib.sha256(archive.read(prefix + name)).hexdigest() != digest:
                raise ValueError('SHA-256 mismatch: ' + name)
        return len(expected)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('Usage: python3 scripts/verify-portable.py /path/to/archive.zip')
    print(f'PASS: {verify(sys.argv[1])} files, paths, CRC and SHA-256 manifest. Nothing extracted or modified.')
