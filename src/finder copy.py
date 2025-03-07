from playwright.sync_api import sync_playwright
import re
import time

class IframeFinder:
    def __init__(self):
        self.playwright = sync_playwright().start()
        self.browser = self.playwright.chromium.launch(headless=True)

    def find_game_source(self, url):
        try:
            page = self.browser.new_page()
            page.goto(url)
            # 等待页面加载
            time.sleep(3)

            # 查找所有iframe
            iframes = page.frames
            game_source = None

            for frame in iframes:
                frame_url = frame.url
                # 检查URL是否包含游戏相关的关键字
                if ('cloud.onlinegames.io' in frame_url and 
                    ('index-og.html' in frame_url or 
                     'unity' in frame_url or 
                     'games' in frame_url)):
                    game_source = frame_url
                    break

            return game_source

        except Exception as e:
            print(f"发生错误: {str(e)}")
            return None
        finally:
            page.close()

    def close(self):
        self.browser.close()
        self.playwright.stop()

def main():
    finder = IframeFinder()
    try:
        url = input("请输入游戏网页地址: ")
        source = finder.find_game_source(url)
        
        if source:
            print(f"\n找到游戏源地址:")
            print(source)
        else:
            print("未找到游戏源地址")
    
    finally:
        finder.close()

if __name__ == "__main__":
    main() 