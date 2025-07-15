import definePlugin, { OptionType } from "@utils/types";
import { React, useState, useEffect } from "@webpack/common";
import { findStoreLazy } from "@webpack";
import { SelectedGuildStore } from "@webpack/common";

const RelationshipStore = findStoreLazy("RelationshipStore");
const UserStore = findStoreLazy("UserStore");
const GuildMemberStore = findStoreLazy("GuildMemberStore");
const GuildStore = findStoreLazy("GuildStore");

function getFriendsInGuild(guildId: string) {
  if (!RelationshipStore || !GuildMemberStore || !UserStore) return [];
  
  const relationships = RelationshipStore.getRelationships();
  const friendIds = Object.entries(relationships)
    .filter(([, type]) => type === 1)
    .map(([id]) => id);
  
  const memberIds = GuildMemberStore.getMemberIds(guildId) ?? [];
  const friendsInGuild = friendIds.filter(id => memberIds.includes(id));
  
  return friendsInGuild.map(id => {
    const user = UserStore.getUser(id);
    return {
      id,
      username: user?.username || "Unknown",
      displayName: user?.globalName || user?.username || "Unknown",
      avatar: user?.avatar,
      discriminator: user?.discriminator || "0"
    };
  });
}

function FriendsListComponent() {
  const [friends, setFriends] = useState([]);
  const [currentGuild, setCurrentGuild] = useState("");
  
  const updateFriends = () => {
    const guildId = SelectedGuildStore?.getGuildId();
    if (guildId) {
      const guildName = GuildStore?.getGuild?.(guildId)?.name || "Unknown Server (Not viewing any server / server not recognized)";
      setCurrentGuild(guildName);
      const friendsData = getFriendsInGuild(guildId);
      setFriends(friendsData);
    } else {
      setCurrentGuild("No Server Selected");
      setFriends([]);
    }
  };
  
  useEffect(() => {
    updateFriends();
    
    const interval = setInterval(updateFriends, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  return React.createElement("div", {
    style: {
      padding: "16px",
      backgroundColor: "var(--background-primary)",
      borderRadius: "8px",
      margin: "16px 0"
    }
  }, [
    React.createElement("h3", {
      key: "title",
      style: {
        margin: "0 0 8px 0",
        color: "var(--header-primary)",
        fontSize: "16px",
        fontWeight: "600"
      }
    }, "Your Friends Here:"),
    
    React.createElement("div", {
      key: "server",
      style: {
        fontSize: "14px",
        color: "var(--text-muted)",
        marginBottom: "12px",
        padding: "4px 8px",
        backgroundColor: "var(--background-secondary)",
        borderRadius: "4px",
        border: "1px solid var(--background-modifier-accent)"
      }
    }, `Server: ${currentGuild}`),
    
    React.createElement("div", {
      key: "refresh",
      style: {
        fontSize: "12px",
        color: "var(--text-muted)",
        marginBottom: "12px",
        textAlign: "center"
      }
    }, "Refreshes every few seconds"),
    
    React.createElement("div", {
      key: "list",
      style: {
        maxHeight: "300px",
        overflowY: "auto",
        border: "1px solid var(--background-modifier-accent)",
        borderRadius: "6px",
        backgroundColor: "var(--background-secondary)"
      }
    }, 
      friends.length > 0 ? 
        friends.map((friend, index) => 
          React.createElement("div", {
            key: friend.id,
            style: {
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: index < friends.length - 1 ? "1px solid var(--background-modifier-accent)" : "none",
              transition: "background-color 0.15s ease"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.backgroundColor = "var(--background-modifier-hover)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }, [
            React.createElement("img", {
              key: "avatar",
              src: friend.avatar 
                ? `https://cdn.discordapp.com/avatars/${friend.id}/${friend.avatar}.png?size=32`
                : `https://cdn.discordapp.com/embed/avatars/${parseInt(friend.discriminator) % 5}.png`,
              style: {
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                marginRight: "12px",
                border: "2px solid var(--background-modifier-accent)"
              },
              onError: (e) => {
                e.target.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(friend.discriminator) % 5}.png`;
              }
            }),
            React.createElement("div", {
              key: "info",
              style: { flex: 1 }
            }, [
              React.createElement("div", {
                key: "display",
                style: {
                  fontWeight: "600",
                  color: "var(--text-normal)",
                  fontSize: "14px"
                }
              }, friend.displayName),
              React.createElement("div", {
                key: "username", 
                style: {
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: "2px"
                }
              }, `@${friend.username}`)
            ]),
            React.createElement("div", {
              key: "status",
              style: {
                fontSize: "10px",
                color: "var(--text-positive)",
                backgroundColor: "var(--background-positive)",
                padding: "2px 6px",
                borderRadius: "10px",
                fontWeight: "500"
              }
            }, "FRIEND")
          ])
        ) :
        React.createElement("div", {
          style: {
            textAlign: "center",
            color: "var(--text-muted)",
            padding: "32px 16px",
            fontSize: "14px"
          }
        }, [
          React.createElement("div", {
            key: "text1"
          }, "It looks like no friends are present here"),
          React.createElement("div", {
            key: "text2",
            style: { fontSize: "12px", marginTop: "4px", opacity: 0.8 }
          }, "Switch to a server where your friends hang out!")
        ])
    ),
    
    React.createElement("div", {
      key: "count",
      style: {
        marginTop: "12px",
        textAlign: "center",
        fontSize: "12px",
        color: "var(--text-muted)",
        padding: "8px",
        backgroundColor: "var(--background-secondary)",
        borderRadius: "4px"
      }
    }, `Total Friends Found: ${friends.length}`)
  ]);
}

export default definePlugin({
  name: "MutualFinder",
  description: "Shows mutuals in your current server, Check Vencord settings to see the list!",
  authors: [{ name: "Randomguy", id: "606383129204359179" }],
  
  settingsAboutComponent: FriendsListComponent,
  
  options: {
    info: {
      type: OptionType.COMPONENT,
      description: "Friends currently in this server will show up!",
      component: () => React.createElement("div", {
        style: {
          padding: "12px",
          backgroundColor: "var(--info-warning-background)",
          color: "var(--info-warning-foreground)",
          borderRadius: "6px",
          fontSize: "13px",
          marginBottom: "12px"
        }
      }, [
        React.createElement("strong", { key: "title" }, "Instructions to use:"),
        React.createElement("br", { key: "br1" }),
        "1. Go to your desired discord server",
        React.createElement("br", { key: "br2" }),
        "2. Open the settings of the plugin",
        React.createElement("br", { key: "br3" }),
        "3. Friends present in this server will be shown above!"
      ])
    }
  }
});
