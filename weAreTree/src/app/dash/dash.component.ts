import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  // User Info
  username;
  userRole = "";
  user = [];
  isRoomAdmin = false;
  isRoomAssis = false;


  // User Location
  isInGroup = false;
  isInChannel = false;
  currentGroup = "";
  currentChannel = "";


  // Join Channels & Groups
  goToGroup = "";
  goToChannel = "";
  goGroupError = "";
  goChannelError = "";


  // Data
  users = [];
  groups = [];


  // Room Data
  groupData = [];
  channel = [];


  // Create User Variables
  newUser = "";
  newEmail = "";
  newRole = "";
  createError = "";


  // Delete User Variable
  killUser = "";
  killError = ""


  // Promote User Variable
  boostUser = "";
  boostRole = "";
  promoteError = "";


  // Add Assistant Variables
  newAssisName = "";
  nAssisError = "";


  // Add Admin Variables
  newAdminName = "";
  nAdminError = "";


  // Create Group Variables
  newGroup = "";
  newAdmin = "";
  gCreateError = "";


  // Destroy Group Variables
  killGroup = "";
  gKillError = "";


  // Invite to Group Variables
  inviteGroupName = "";
  inviteGroupUser = "";
  inviteGroupRole = "";
  inviteGroupUserName = "";
  iGroupError = "";
  iGroupUserError = "";
  iInGroupError = "";


  // Revoke from Group Variables
  revokeGroupName = "";
  revokeGroupUser = "";
  rGroupError = "";


  // Create Channel Variables
  newChanGroup = "";
  newChan = "";
  cCreateError = "";


  // Destroy Channel Variables
  killChanGroup = ""
  killChan = "";
  cKillError = "";


  // Invite to Channel Variables
  inviteChanGroupName = "";
  inviteChanName = "";
  inviteChanUser = "";
  inviteChannelUserName = "";
  iChanError = "";
  iInChannelError = "";


  // Revoke from Channel Variables
  revokeChanGroupName = "";
  revokeChanName = "";
  revokeChanUser = "";
  rChanError = "";


  // Error variables for display
  serverErrorUser = "";
  serverErrorGroup = "";
  serverErrorChannel = "";

  constructor(private http: HttpClient, private router: Router) { }

  // Function Creates New User
  createUser() {
    this.resetErrors();
    if (this.newUser && this.newEmail && this.newRole) {
      let userObj = {
        "newUser": this.newUser,
        "newEmail": this.newEmail,
        "newRole": this.newRole,
      }

      this.http.post<any>(BACKEND_URL + "/newUser", userObj).subscribe((data) => {
        console.log(data);
        if (!data.error) {
          console.log(data);
          this.users = data;
          this.trimUsers();
        } else {
          this.serverErrorUser = data.error;
        }
        this.resetValues();
      });
    } else {
      this.createError = "...Just fill in the options " + this.username;
    }
  }

  // Function Deletes User
  destroyUser() {
    this.resetErrors();
    if (this.killUser) {
      let userObj = { "username": this.killUser };

      this.http.post<any>(BACKEND_URL + "/destroyUser", userObj).subscribe((data) => {
        console.log(data)
        this.users = data;
        this.trimUsers();
        this.resetValues();
      });
    } else {
      this.killError = "...Just pick an option"
    }
  }

  //Function Grants New Role to User
  promoteUser() {
    this.resetErrors();
    if (this.boostUser && this.boostRole) {
      let userObj = {
        "username": this.boostUser,
        "role": this.boostRole
      }

      this.http.post<any>(BACKEND_URL + "/promoteUser", userObj).subscribe((data) => {
        console.log(data);
        this.users = data.users;
        this.groups = data.groups;
        this.trimUsers();
        this.resetValues();
      });
    } else {
      this.promoteError = "...Just pick an option"
    }
  }

  // Function Creates New Group
  createGroup() {
    this.resetErrors();
    if (this.newGroup) {
      let groupObj = {
        "groupName": this.newGroup,
        "groupAdmin": this.newAdmin,
        "user": this.username
      }

      this.http.post<any>(BACKEND_URL + "/newGroup", groupObj).subscribe((data) => {
        console.log(data);
        if (!data.error) {
          this.groups = data;
          this.trimGroups();
        } else {
          this.serverErrorGroup = data.error;
        }
        this.resetValues();
      });
    } else {
      this.gCreateError = "...Mate just pick a name Ay";
    }
  }

  // Function Destroys Group
  destroyGroup() {
    this.resetErrors();
    if (this.killGroup) {
      let groupObj = { "name": this.killGroup };

      this.http.post<any>(BACKEND_URL + "/destroyGroup", groupObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        this.trimGroups();
        this.resetValues();
      });
    } else {
      this.gKillError = "...Just pick a room mate";
    }
  }

  // Function Creates new Channel
  createChannel() {
    this.resetErrors();
    if (this.newChanGroup && this.newChan) {
      let chanObj = {
        "channelGroup": this.newChanGroup,
        "channelName": this.newChan
      }

      this.http.post<any>(BACKEND_URL + "/newChannel", chanObj).subscribe((data) => {
        console.log(data);
        if (!data.error) {
          this.groups = data;
          this.trimGroups();
        } else {
          this.serverErrorChannel = data.error;
        }
        this.resetValues();
      });
    } else {
      this.cCreateError = "...Mate just pick a name Ay";
    }
  }

  // Function Destroys Channel
  destroyChannel() {
    this.resetErrors();
    if (this.killChanGroup && this.killChan) {
      let chanObj = {
        "channelGroup": this.killChanGroup,
        "channelName": this.killChan
      };

      this.http.post<any>(BACKEND_URL + "/destroyChannel", chanObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        this.trimGroups();
        this.resetValues();
      });
    } else {
      this.cKillError = "...Just pick a room mate";
    }
  }

  // Function Grants Access Rights To Group
  inviteGroup() {
    this.resetErrors();
    if (this.inviteGroupName && this.inviteGroupUser) {
      let invObj = {
        "groupName": this.inviteGroupName,
        "username": this.inviteGroupUser,
        "role": this.inviteGroupRole
      };

      if (!this.inviteGroupRole) {
        invObj.role = "user";
      }

      this.http.post<any>(BACKEND_URL + "/inviteGroup", invObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        this.trimGroups();
        this.resetValues();
      });
    } else {
      this.iGroupError = "...Just pick a dude mate";
    }
  }

  // Function grants access rights to group from within group
  inviteGroupInGroup() {
    this.resetErrors();
    if (this.currentGroup && this.inviteGroupUserName) {
      let invObj = {
        "groupName": this.currentGroup,
        "username": this.inviteGroupUserName,
        "role": "user"
      };

      this.http.post<any>(BACKEND_URL + "/inviteGroup", invObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        for (let i = 0; i < this.groups.length; i++) {
          if (this.currentGroup == this.groups[i].name) {
            this.groupData = this.groups[i];
            console.log(this.groupData);
          }
        }
        this.trimGroups();
        this.resetValues();
      });
    } else {
      this.iInGroupError = "...Just pick a dude mate";
    }
  }

  // Function Revokes Access rights to Group
  revokeGroup() {
    this.resetErrors();
    if (this.revokeGroupName && this.revokeGroupUser) {
      let invObj = {
        "groupName": this.revokeGroupName,
        "username": this.revokeGroupUser,
        "role": this.inviteGroupRole
      };

      this.http.post<any>(BACKEND_URL + "/revokeGroup", invObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        this.trimGroups();
        this.resetValues();
      });
    } else {
      this.rGroupError = "...Just pick a dude mate";
    }
  }

  // Function Grants Access Rights To Channel
  inviteChannel() {
    this.resetErrors();
    if (this.inviteChanGroupName && this.inviteChanName && this.inviteChanUser) {
      let invObj = {
        "groupName": this.inviteChanGroupName,
        "channelName": this.inviteChanName,
        "username": this.inviteChanUser
      };

      this.http.post<any>(BACKEND_URL + "/inviteChannel", invObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        this.trimGroups();
        this.resetValues();
      });
    } else {
      this.iChanError = "...Just pick a dude mate";
    }
  }

  // Function adds new user to channel from within that channel
  inviteChannelInChannel() {
    this.resetErrors();
    if (this.currentChannel && this.currentGroup && this.inviteChannelUserName) {
      let invObj = {
        "groupName": this.currentGroup,
        "channelName": this.currentChannel,
        "username": this.inviteChannelUserName
      };

      this.http.post<any>(BACKEND_URL + "/inviteChannel", invObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        this.trimGroups();
        this.resetValues();
      });
    } else {
      this.iInChannelError = "...Just pick a dude mate";
    }
  }

  //Function Revokes Access rights to channel
  revokeChannel() {
    this.resetErrors();
    if (this.revokeChanGroupName && this.revokeChanName && this.revokeChanUser) {
      let invObj = {
        "groupName": this.revokeChanGroupName,
        "channelName": this.revokeChanName,
        "username": this.revokeChanUser
      };

      this.http.post<any>(BACKEND_URL + "/revokeChannel", invObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        this.trimGroups();
        this.resetValues();
      });
    } else {
      this.rChanError = "...Just pick a dude mate";
    }
  }

  // Function promotes user to Admin of Current Room
  newAdminG() {
    this.resetErrors();
    if (this.newAdminName) {
      let adObj = {
        "username": this.newAdminName,
        "group": this.currentGroup
      }

      this.http.post<any>(BACKEND_URL + "/newAdmin", adObj).subscribe((data) => {
        console.log(data);
        this.groups = data;
        this.trimGroups();
        for (let i = 0; i < this.groups.length; i++) {
          if (this.currentGroup == this.groups[i].name) {
            this.groupData = this.groups[i];
          }
        }
      });
      this.resetValues();
    } else {
      this.nAdminError = "Pick a dude bruv";
    }
  }

  // Function promotes user to Assis of Current Room
  newAssis() {
    this.resetErrors();
    if (this.newAssisName) {
      let assObj = {
        "username": this.newAssisName,
        "group": this.currentGroup
      }

      this.http.post<any>(BACKEND_URL + "/newAssis", assObj).subscribe((data) => {
        console.log(data);
        this.groups = data.groups;
        this.trimGroups();
        this.users = data.users;
        for (let i = 0; i < this.groups.length; i++) {
          if (this.currentGroup == this.groups[i].name) {
            this.groupData = this.groups[i];
          }
        }
      });
      this.resetValues();
    } else {
      this.nAssisError = "Pick a dude bruv";
    }
  }

  // Function allows user to join group
  joinGroup() {
    this.resetErrors();
    if (this.goToGroup) {
      this.isInGroup = true;
      this.currentGroup = this.goToGroup;
      this.isRoomAdmin = false;
      this.isRoomAssis = false;
      this.goToGroup = "";
      for (let i = 0; i < this.groups.length; i++) {
        if (this.currentGroup == this.groups[i].name) {
          this.groupData = this.groups[i];
          console.log(this.groupData);
          if (this.groups[i].admin == this.username) {
            this.isRoomAdmin = true;
          }
          if (this.groups[i].assis.includes(this.username)) {
            this.isRoomAssis = true;
          }
        }
      }
      this.isInChannel = false;
      this.IAmSuper();
      console.log(this.groupData)
    } else {
      this.goGroupError = "Pick a Group Mate.."
    }
  }

  // Function allows user to join Channel
  joinChannel(channelO) {
    this.resetErrors();
    console.log(channelO);
    if (channelO) {
      this.isInChannel = true;
      this.currentChannel = channelO;
      this.resetValues();
    }
    if (this.goToChannel) {
      if (!this.isInGroup || this.currentGroup != this.goToGroup) {
        this.joinGroup();
      }
      this.isInChannel = true;
      this.currentChannel = this.goToChannel;
      this.resetValues();
    } else {
      this.goChannelError = "Pick a Channel Mate.."
    }
  }

  // Function Leaves Current Group
  leaveGroup() {
    this.resetErrors();
    if (this.isInChannel) {
      this.leaveChannel();
    }
    this.isInGroup = false;
    this.currentGroup = "";
    if (this.isRoomAdmin || this.isRoomAssis) {
      this.isRoomAdmin = false;
      this.isRoomAssis = false;
      this.resetValues();
    }
  }

  // Function Leaves Current Room
  leaveChannel() {
    this.isInChannel = false;
    this.currentChannel = "";
    this.resetValues();
  }

  // Function clears storage and logs user out
  logout() {
    localStorage.clear()
    this.router.navigateByUrl("/");
  }

  // Function returns Current User's data
  fetchUser() {
    let userObj = { "username": this.username };
    this.http.post<any>(BACKEND_URL + "/fetchUser", userObj).subscribe((data) => {
      console.log(data)
      this.user = data;
    });
  }

  // Functions returns the Current User's role
  fetchRole() {
    let userObj = { "username": this.username };
    this.http.post<any>(BACKEND_URL + "/fetchRole", userObj).subscribe((data) => {
      this.userRole = data.role;
      console.log(this.userRole);
    });
  }

  // Function returns a list of all users
  fetchUsers() {
    let userObj = { "username": this.username };
    this.http.post<any>(BACKEND_URL + "/fetchUsers", userObj).subscribe((data) => {
      this.users = data;
      this.trimUsers();
    });
  }

  // Function returns a list of all groups in the server and trims groups which are irrelevant to Current User
  fetchGroups() {
    let groupObj = { "message": "G'day maite could I get some groups over 'ere" };
    this.http.post<any>(BACKEND_URL + "/fetchGroups", groupObj).subscribe((data) => {
      this.groups = data;
      this.trimGroups();
      console.log(this.groups)
    });
  }

  // Function fetches all necessary data about groups and users from server
  ngOnInit() {
    this.username = localStorage.getItem("username");
    this.fetchUser();
    this.fetchRole();
    this.fetchUsers();
    this.fetchGroups();
    this.resetErrors();
    this.resetValues();
  }


  // Function removes Current User from user list
  trimUsers() {
    for (let i = 0; i < this.users.length; i++) {
      if (this.username == this.users[i].username) {
        this.users.splice(i, 1);
        console.log(this.users);
      }
    }
  }

  // Function takes list of all groups in database and removes groups which are
  // irrelevant to current user
  trimGroups() {
    if (this.userRole != 'super') {
      for (let i = this.groups.length - 1; i >= 0; i--) {
        if (this.groups[i].admin != this.username && !this.groups[i].assis.includes(this.username) && !this.groups[i].users.includes(this.username)) {
          this.groups.splice(i, 1);
        } else {
          if (this.groups[i].admin != this.username && !this.groups[i].assis.includes(this.username)) {
            if (this.groups[i].channels != []) {
              for (let j = this.groups[i].channels.length - 1; j >= 0; j--) {
                if (!this.groups[i].channels[j].access.includes(this.username)) {
                  this.groups[i].channels.splice(j, 1);
                }
              }
            }
          }
        }
      }
      console.log(this.groups);
    }
  }

  // Function sets Super Admin values to highest privilege in each room
  IAmSuper() {
    if (this.userRole == 'super') {
      this.isRoomAdmin = true;
      this.isRoomAssis = true;
    }
  }

  // Function Resets Value of all Errors
  resetErrors() {
    this.goGroupError = "";
    this.goChannelError = "";
    this.serverErrorUser = "";
    this.serverErrorGroup = "";
    this.serverErrorChannel = "";
    this.rChanError = "";
    this.iChanError = "";
    this.cKillError = "";
    this.cCreateError = "";
    this.rGroupError = "";
    this.iGroupError = "";
    this.gKillError = "";
    this.gCreateError = "";
    this.nAssisError = "";
    this.promoteError = "";
    this.killError = ""
    this.createError = "";
    this.nAssisError = "";
    this.nAdminError = "";
    this.iGroupUserError = "";
    this.iInGroupError = "";
    this.iInChannelError = ""
  }


  // Function Resets Value of all Forms
  resetValues() {
    this.goToGroup = "";
    this.goToChannel = "";
    this.newUser = "";
    this.newEmail = "";
    this.newRole = "";
    this.killUser = "";
    this.boostUser = "";
    this.boostRole = "";
    this.newAssisName = "";
    this.newAdminName = "";
    this.newGroup = "";
    this.newAdmin = "";
    this.killGroup = "";
    this.inviteGroupName = "";
    this.inviteGroupUser = "";
    this.inviteGroupRole = "";
    this.revokeGroupName = "";
    this.revokeGroupUser = "";
    this.newChanGroup = "";
    this.newChan = "";
    this.killChanGroup = ""
    this.killChan = "";
    this.inviteChanGroupName = "";
    this.inviteChanName = "";
    this.inviteChanUser = "";
    this.inviteGroupUserName = "";
    this.inviteChannelUserName = "";
  }
}