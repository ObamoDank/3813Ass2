import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SocketsService } from '../service/sockets.service';


const BACKEND_URL = "http://localhost:3000";

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  // Socket Information
  private socket;

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
  newPass = "";
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

  constructor(private http: HttpClient, private router: Router, private socketService: SocketsService) { }

  // Function Creates New User
  async createUser() {
    this.resetErrors();
    if (this.newUser && this.newPass && this.newEmail && this.newRole) {
      let userObj = {
        "newUser": this.newUser,
        "newPass": this.newPass,
        "newEmail": this.newEmail,
        "newRole": this.newRole,
      }

      await this.http.post<any>(BACKEND_URL + "/newUser", userObj).subscribe((data) => {
        console.log(data);
        if (!data.error) {
          this.fetchUsers();
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
  async destroyUser() {
    this.resetErrors();
    if (this.killUser) {
      let userObj = { "username": this.killUser };

      await this.http.post<any>(BACKEND_URL + "/destroyUser", userObj).subscribe((data) => {
        console.log(data);
        this.fetchUsers();
        this.resetValues();
        this.getBoth();
      });
    } else {
      this.killError = "...Just pick an option"
    }
  }

  //Function Grants New Role to User
  async promoteUser() {
    this.resetErrors();
    if (this.boostUser && this.boostRole) {
      let userObj = {
        "username": this.boostUser,
        "role": this.boostRole
      }

      await this.http.post<any>(BACKEND_URL + "/promoteUser", userObj).subscribe((data) => {
        console.log(data);
        this.fetchUsers();
        this.fetchGroups();
        this.resetValues();
        this.getBoth();
      });
    } else {
      this.promoteError = "...Just pick an option"
    }
  }

  // Function Creates New Group
  async createGroup() {
    this.resetErrors();
    if (this.newGroup) {
      let groupObj = {
        "groupName": this.newGroup,
        "groupAdmin": this.newAdmin,
        "user": this.username
      }

      await this.http.post<any>(BACKEND_URL + "/newGroup", groupObj).subscribe((data) => {
        console.log(data);
        if (!data.error) {
          this.fetchGroups();
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
  async destroyGroup() {
    this.resetErrors();
    if (this.killGroup) {
      if (this.currentGroup == this.killGroup) {
        this.currentGroup = "";
        this.isInGroup = false;
        this.currentChannel = "";
        this.isInChannel = false;
      }
      let groupObj = { "name": this.killGroup };

      await this.http.post<any>(BACKEND_URL + "/destroyGroup", groupObj).subscribe((data) => {
        this.fetchGroups();
        this.resetValues();
        if (this.isInGroup) {
          for (let i = 0; i < this.groups.length; i++) {
            if (this.currentGroup == this.groups[i].name) {
              this.groupData = this.groups[i];
              console.log(this.groupData);
            }
          }
        }
      });
    } else {
      this.gKillError = "...Just pick a group mate";
    }
  }

  // Function Creates new Channel
  async createChannel() {
    this.resetErrors();
    if (this.newChanGroup && this.newChan) {
      let chanObj = {
        "channelGroup": this.newChanGroup,
        "channelName": this.newChan
      }

      await this.http.post<any>(BACKEND_URL + "/newChannel", chanObj).subscribe((data) => {
        console.log(data);
        if (!data.error) {
          this.fetchGroups();
          this.getBoth();
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
  async destroyChannel() {
    this.resetErrors();
    if (this.killChanGroup && this.killChan) {
      if (this.currentChannel == this.killChan) {
        this.currentChannel = "";
        this.isInChannel = false;
      }
      let chanObj = {
        "channelGroup": this.killChanGroup,
        "channelName": this.killChan
      };

      await this.http.post<any>(BACKEND_URL + "/destroyChannel", chanObj).subscribe((data) => {
        console.log(data);
        this.fetchGroups();
        this.resetValues();
      });
    } else {
      this.cKillError = "...Just pick a room mate";
    }
  }

  // Function Grants Access Rights To Group
  async inviteGroup() {
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

      await this.http.post<any>(BACKEND_URL + "/inviteGroup", invObj).subscribe((data) => {
        console.log(data);
        this.fetchGroups()
        this.resetValues();
        this.getBoth();
      });
    } else {
      this.iGroupError = "...Just pick a dude mate";
    }
  }

  // Function grants access rights to group from within group
  async inviteGroupInGroup() {
    this.resetErrors();
    if (this.currentGroup && this.inviteGroupUserName) {
      let invObj = {
        "groupName": this.currentGroup,
        "username": this.inviteGroupUserName,
        "role": "user"
      };

      await this.http.post<any>(BACKEND_URL + "/inviteGroup", invObj).subscribe((data) => {
        console.log(data);
        this.fetchGroups();
        this.getBoth();
        this.resetValues();
      });
    } else {
      this.iInGroupError = "...Just pick a dude mate";
    }
  }

  // Function Revokes Access rights to Group
  async revokeGroup() {
    this.resetErrors();
    if (this.revokeGroupName && this.revokeGroupUser) {
      let invObj = {
        "groupName": this.revokeGroupName,
        "username": this.revokeGroupUser,
        "role": this.inviteGroupRole
      };

      await this.http.post<any>(BACKEND_URL + "/revokeGroup", invObj).subscribe((data) => {
        console.log(data);
        this.fetchGroups();
        this.resetValues();
        this.getBoth();
      });
    } else {
      this.rGroupError = "...Just pick a dude mate";
    }
  }

  // Function Grants Access Rights To Channel
  async inviteChannel() {
    this.resetErrors();
    if (this.inviteChanGroupName && this.inviteChanName && this.inviteChanUser) {
      let invObj = {
        "groupName": this.inviteChanGroupName,
        "channelName": this.inviteChanName,
        "username": this.inviteChanUser
      };

      await this.http.post<any>(BACKEND_URL + "/inviteChannel", invObj).subscribe((data) => {
        console.log(data);
        this.fetchGroups();
        this.resetValues();
        this.getBoth();
      });
    } else {
      this.iChanError = "...Just pick a dude mate";
    }
  }

  // Function adds new user to channel from within that channel
  async inviteChannelInChannel() {
    this.resetErrors();
    if (this.currentChannel && this.currentGroup && this.inviteChannelUserName) {
      let invObj = {
        "groupName": this.currentGroup,
        "channelName": this.currentChannel,
        "username": this.inviteChannelUserName
      };

      await this.http.post<any>(BACKEND_URL + "/inviteChannel", invObj).subscribe((data) => {
        console.log(data);
        this.fetchGroups();
        this.getBoth();
        this.resetValues();
      });
    } else {
      this.iInChannelError = "...Just pick a dude mate";
    }
  }

  //Function Revokes Access rights to channel
  async revokeChannel() {
    this.resetErrors();
    if (this.revokeChanGroupName && this.revokeChanName && this.revokeChanUser) {
      let invObj = {
        "groupName": this.revokeChanGroupName,
        "channelName": this.revokeChanName,
        "username": this.revokeChanUser
      };

      await this.http.post<any>(BACKEND_URL + "/revokeChannel", invObj).subscribe((data) => {
        console.log(data);
        this.fetchGroups();
        this.resetValues();
        this.getBoth();
      });
    } else {
      this.rChanError = "...Just pick a dude mate";
    }
  }

  // Function promotes user to Admin of Current Room
  async newAdminG() {
    this.resetErrors();
    if (this.newAdminName) {
      let adObj = {
        "username": this.newAdminName,
        "group": this.currentGroup
      }

      await this.http.post<any>(BACKEND_URL + "/newAdmin", adObj).subscribe(async (data) => {
        await this.fetchGroups();
        await this.getCurrentGroup();
        if (this.isInChannel) {
          await this.getCurrentChannel();
        }
      });
      this.resetValues();
    } else {
      this.nAdminError = "Pick a dude bruv";
    }
  }

  // Function promotes user to Assis of Current Room
  async newAssis() {
    this.resetErrors();
    if (this.newAssisName) {
      let assObj = {
        "username": this.newAssisName,
        "group": this.currentGroup
      }

      this.http.post<any>(BACKEND_URL + "/newAssis", assObj).subscribe(async (data) => {
        await this.fetchGroups();
        await this.fetchUsers();
        await this.getCurrentGroup();
        if (this.isInChannel) {
          await this.getCurrentChannel();
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
      this.getBoth();
      this.resetValues();
    }
    if (this.goToChannel) {
      if (!this.isInGroup || this.currentGroup != this.goToGroup) {
        this.joinGroup();
      }
      this.isInChannel = true;
      this.currentChannel = this.goToChannel;
      this.getCurrentChannel();
      this.resetValues();
    } else {
      this.goChannelError = "Pick a Channel Mate.."
    }
  }

  // Function retrieves Data about the current channel
  async getCurrentChannel() {
    for (let i = 0; i < this.groups.length; i++) {
      for (let j = 0; j < this.groups[i].channels.length; j++) {
        if (this.currentChannel == this.groups[i].channels[j].name) {
          this.channel = this.groups[i].channels[j];
          console.log(this.channel);
        }
      }
    }
  }

  // Function retrieves Data about the current group
  async getCurrentGroup() {
    for (let i = 0; i < this.groups.length; i++) {
      if (this.currentGroup == this.groups[i].name) {
        this.groupData = this.groups[i];
        console.log(this.groupData);
      }
    }
  }

  // Function retrieves both group data and channel data
  async getBoth(){
    if (this.isInGroup) {
      this.getCurrentGroup()
      if (this.isInChannel) {
         this.getCurrentChannel();
      }
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
    this.groupData = [];
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
    this.channel = [];
    this.resetValues();
  }

  // Function clears storage and logs user out
  logout() {
    localStorage.clear()
    this.router.navigateByUrl("/");
  }

  // Function returns Current User's data
  async fetchUser() {
    let userObj = { "username": this.username };
    await this.http.post<any>(BACKEND_URL + "/fetchUser", userObj).subscribe((data) => {
      console.log(data)
      this.user = data;
    });
  }

  // Functions returns the Current User's role
  async fetchRole() {
    let userObj = { "username": this.username };
    await this.http.post<any>(BACKEND_URL + "/fetchRole", userObj).subscribe((data) => {
      this.userRole = data.role;
      console.log(this.userRole);
    });
  }

  // Function returns a list of all users
  async fetchUsers() {
    let userObj = { "username": this.username };
    await this.http.post<any>(BACKEND_URL + "/fetchUsers", userObj).subscribe((data) => {
      this.users = data;
      this.trimUsers();
    });
  }

  // Function returns a list of all groups in the server and trims groups which are irrelevant to Current User
  async fetchGroups() {
    let groupObj = { "message": "G'day maite could I get some groups over 'ere" };
    await this.http.post<any>(BACKEND_URL + "/fetchGroups", groupObj).subscribe((data) => {
      this.groups = data;
      this.trimGroups();
      console.log(this.groups)
    });
  }

  // Function fetches all necessary data about groups and users from server
  async ngOnInit() {
    this.username = localStorage.getItem("username");
    this.socketService.initSocket();
    await this.fetchUser();
    await this.fetchRole();
    await this.fetchUsers();
    await this.fetchGroups();
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
    this.newPass = "";
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
    this.revokeChanGroupName = "";
    this.revokeChanName = "";
    this.revokeChanUser = "";
  }

  // Socket Services
  
}