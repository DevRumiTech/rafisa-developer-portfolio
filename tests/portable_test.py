import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('verify_portable', Path(__file__).resolve().parents[1] / 'scripts/verify-portable.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class PortableTests(unittest.TestCase):
    def archive(self, directory, data=b'original', extra=None):
        path = Path(directory) / 'test.zip'
        manifest = {'files': {'source.txt': hashlib.sha256(b'original').hexdigest()}}
        with zipfile.ZipFile(path, 'w') as archive:
            archive.writestr('project/source.txt', data)
            archive.writestr('project/PORTABLE-BACKUP-MANIFEST.json', json.dumps(manifest))
            if extra:
                archive.writestr(extra, b'extra')
        return path

    def test_valid(self):
        with tempfile.TemporaryDirectory() as directory:
            self.assertEqual(module.verify(self.archive(directory)), 1)

    def test_changed_content(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(ValueError, 'SHA-256'):
                module.verify(self.archive(directory, b'changed'))

    def test_unlisted_file(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(ValueError, 'file list'):
                module.verify(self.archive(directory, extra='project/unlisted.txt'))

    def test_unsafe_path(self):
        with tempfile.TemporaryDirectory() as directory:
            with self.assertRaisesRegex(ValueError, 'Unsafe'):
                module.verify(self.archive(directory, extra='../outside.txt'))


if __name__ == '__main__':
    unittest.main()
