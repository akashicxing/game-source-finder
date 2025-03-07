import unittest
from src.finder import IframeFinder

class TestIframeFinder(unittest.TestCase):
    def setUp(self):
        self.finder = IframeFinder()
    
    def tearDown(self):
        self.finder.close()
    
    def test_find_iframe_source(self):
        url = "https://www.onlinegames.io/monster-survivors/"
        sources = self.finder.find_iframe_source(url)
        self.assertTrue(len(sources) > 0)
        self.assertTrue(any('monster-survivors' in src for src in sources))

if __name__ == '__main__':
    unittest.main() 