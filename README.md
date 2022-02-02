# Collaborative Drawing App (reactjs & nodejs)   

# • Link: https://hani-collaborative-drawing-app.herokuapp.com/   

A real time collaborative drawing app that uses [socket.io](https://www.npmjs.com/package/socket.io) and [socket.io-client](https://www.npmjs.com/package/socket.io-client) with multiple features.

***• Features:*** 
- Rooms system: users can join rooms and each room can take up to 5 users.   
- Leader role: 1 user can be the leader of a room, leader does have permissions like kicking, promoting and allowing others to use drawing brush or eraser.   
- The app does handle disconnecting/leaving, for example if the leader left then someone else will get promoted to leader automatically.   
- Tools box: brush, brush width, brush color, eraser, clear board for all (only leader can use it), change background color (locally).
- Real time chat: with time ago feature using [timeago.js](https://www.npmjs.com/package/timeago.js), system messages whenever someone joins or leaves or gets promoted, smooth auto scrolling and the ability to scroll up to catch up with old unread messages.

***Packages and tech i used to make this app:***   
*• Frontend:*   
- Reactjs hooks: useState, useEffect, useContext, useCallback.   
- Npm packages: react-icons, socket.io-client, timeago.js.

*• Backend:*   
- Nodejs: express.   
- Npm packages: socket.io.   
- Npm packages i used for development only:  env-cmd, nodemon.   
   

***NOTES:***   
*If 2 or more users were drawing at the exact same time, experience might not be optimal, due to how socket.io handle things.   
*Drawing board listens to mouse events only, that means it won't work with other devices like mobile phones.

---

- welcome page:    
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/welcome.jpg)
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/welcome1.jpg)

- after joining:   
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/joined.jpg)
- multiple users joining:     
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/users.jpg)
- promoting:    
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/promotion.jpg)
- kicking:   
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/kicking.jpg)
- chat & scrolling up:   
![alt_text](https://github.com/Hani-ALHamad/react-node-collaborative-drawing-app/blob/main/chat1.jpg)
![alt_text](https://github.com/Hani-ALHamad/react-node-collaborative-drawing-app/blob/main/chat2.jpg)
- drawing:   
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/drawing.jpg)
- background color:   
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/color1.jpg)
- info:   
![alt_text](https://raw.githubusercontent.com/Hani-ALHamad/react-node-collaborative-drawing-app/main/info.jpg)
