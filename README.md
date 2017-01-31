weibo-follow-clean
===
## 简单粗暴的微博粉丝清理 - 猴子版
一上午爆肝两小时完成，截图时的运行逻辑有问题跑了一遍才意识到（应该从第十页倒序到第一页防漏，代码里改了）

因为还有事情只能写基本功能了，初六回来后*有可能*写个UI？

安装：Firefox:Greasemonkey Chrome:Tampermonkey，然后点进脚本的[Raw](https://github.com/esterTion/weibo-follow-clean/raw/master/Weibo_Follow_Clean.user.js)

![](https://github.com/esterTion/weibo-follow-clean/blob/master/img/wfc1.png)
![](https://github.com/esterTion/weibo-follow-clean/blob/master/img/wfc2.png)

# 原始Readme
## 简单粗暴的微博粉丝清理

> python3 weibo.py

因为登录需要验证码 + 个人能力问题没有集成登录功能，需要手动填写cookie
  ←  于是反正执行的时候会提示填写的

![](https://github.com/TimeCompass/weibo-follow-clean/blob/master/img/cookie.png)
SUB="你需要复制的内容";
在 = 和 ; 之间

同样的理由需要填写用户的数字ID
  ←  于是反正执行的时候会提示填写的

![](https://github.com/TimeCompass/weibo-follow-clean/blob/master/img/id.png)
没错就是那串数字

  ←  所以反正你直接在脚本里改掉注释掉提示也一样

默认只分析最后（页面显示是最前）的十页粉丝，这是一个MAGIC NUMBER，不要问我为什么。

P.S. 谁写个js油猴脚本吼不吼啊，求造福大众。