# Genshin Impact offical comic downloader
This tool can crawl every single page of the Genshin Impact comic from the Official Genshin website.
I made this because the comic reader interface on the official website is shitty, on a pc you can't even zoom.

("offical" here is about the comic from miHoYo's genshin website, this tool is just... a tool and not related to miHoYo in any way).

# How to use
You have to have NodeJS installed on your computer. I will not go into details because this tool for now is intended for software developers.

Open your command promnt and navigate to this tool's folder, install all dependencies:
```
npm i
```

I created a source.json file to download Japanese version (ja), Simplified Chinese version (cn), Vietnamese version (vi) and English version (en). You can add your config to that file to download your desired version (which miHoYo has). The result would be stored in a folder called `output` in this tool's folder.

Assuming you want to download the English version, use this command:
```
node main en
```
