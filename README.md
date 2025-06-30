# MutualFinder
Simple userplugin made for [Vencord](https://vencord.dev) that displays all mutuals in the current discord server you are viewing.

## 📥 Installation

Install MutualFinder using git clone (Assuming /Vencord/src is already present but ../userplugins is not)

```bash
  git clone https://github.com/randomguy6407/MutualFinder.git
  vcpath=$(find ~ -type d -path "*/Vencord/src" -print -quit)
  mkdir -p "$vcpath/userplugins"
  cp -r MutualFinder "$vcpath/userplugins"

  

```
    
## 🛠️ Building Vencord from base
As Vencord requires users to manually build the source from scratch and inject it into Discord, it requires you to download Vencord from the source.
Link to the official Vencord installation process:

https://docs.vencord.dev/installing/

## ❓ FAQ 

## 🤔 Why did i build this?
I was actually particularly interested in what servers my friends are inside together with me, and i figured that it would take too much time and effort to individually hand check each server. So I decided to build this userplugin for [Vencord](https://vencord.dev) to automatically scan your entire friend list in your current focused server for mutual friends in that specific server.

## 🤔 What technical difficulties did you face?
During the making of this userplugin, i faced a technical limitation with discord's internal stores where GuildMemberStore.getMemberIds only returns a small list of members in the current focused server. This means that in a very large server with tens or even hundreds of thousands of members, GuildMemberStore.getMemberIds would only return a handful of members, which makes the userplugin ineffective. To circumvent this, i went to read the documentation of a discord self-bot API called [Discord-S.C.U.M](https://github.com/Merubokkusu/Discord-S.C.U.M), there i found that i could craft raw API calls to discord for each friend to retrieve their [profile](https://github.com/Merubokkusu/Discord-S.C.U.M/blob/master/docs/using/REST_Actions.md) which returns their mutual_guilds to cross refer with the current focused server which makes my userplugin effective.
