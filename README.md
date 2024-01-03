# Chessi
## _A real-time, elo-based online chess game with matchmaking_

## Features 
- Play online against other players/bot.
- In-match conversations.
- Match spectator mode.
- Match analysis (premium feature).
- Social features: connect with friends, create posts, view match results, ranking and customize profile.

<a href="https://docs.google.com/spreadsheets/d/1z9Phjlf06sw7jjuOinoH5bs-Hfou5OYCP_5bG5yTaMs/edit?usp=sharing" target="_blank">Link to detailed sheet with all features here</a>


## Tech
- Backend:
    - Node.js (runtime)
    - Express (framework)
    - Socket.io (realtime communication)
- Frontend:
    - React.js (framework)
    

## Installation
#### _Pre-requisites_
- Node.js v18.14.0
- MySQL
- Text editor (Visual Studio Code)
- Git
- A web browser

#### _Step-by-step_
1. Clone the repository
```sh
git clone https://github.com/hwangahn/chessi.git
```
2. Navigate to /chessi and open Visual Studio Code
![alt text](https://scontent.xx.fbcdn.net/v/t1.15752-9/412399515_1052932516017578_8231178931557218208_n.png?_nc_cat=104&ccb=1-7&_nc_sid=510075&_nc_ohc=26u3zIVI4sgAX89MtI2&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&cb_e2o_trans=q&oh=03_AdT9GMga2ZywZwzmSZQ-xGGEXbG4tQQiIe8HQgajXKzojw&oe=65BD0379)
3. In VS Code, navigate to /chessi_be folder and create a .env file
![alt text](https://scontent.xx.fbcdn.net/v/t1.15752-9/413473933_773155544637143_300910354335167766_n.png?_nc_cat=107&ccb=1-7&_nc_sid=510075&_nc_ohc=wz7hLFAcbvMAX_zJFZc&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&cb_e2o_trans=q&oh=03_AdQKiKH731eNC92TRlj209ng5vZmhneUCHvoQRyEOTDP7g&oe=65BCEDE0)
4. Paste the following text into the .env file
```
    PORT="5000"
    # Replace username and password in the line below with username and password from MySQL, then remove the '#'.
    # DB_KEY="mysql://username:password@localhost:3306/chessi"
    MAIL_SERVER_USERNAME="chessi.noreply@gmail.com"
    MAIL_SERVER_PASSWORD="vynj vjsa aefq kayt"
    SECRET_WORD="motdoiliemkhiet"
    CLIENT_URL="http://localhost:3000"
```
5. Navigate to /chessi_fe and create a .env file with the following content:
```
    VITE_SERVER_URL="http://localhost:5000"
```
6. Open and split terminal in VS Code
![alt text](https://scontent.xx.fbcdn.net/v/t1.15752-9/412610673_328843749968230_8372834434662345577_n.png?_nc_cat=101&ccb=1-7&_nc_sid=510075&_nc_ohc=23fJutsRyF0AX8We38Q&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&cb_e2o_trans=q&oh=03_AdS5KawyEfiB5R7frb3c3bZAoOr8GT0UYcIzy4sq_Kowuw&oe=65BD032C)
7. Paste and run the following command sequences into each terminal (one command at a time and one sequence for each terminal):
```
    cd chessi_fe
    npm i
    npm run dev
```
```
    cd chessi_be
    npm i
    node index
```
If encounter error, run the command again.

8. Open browser and visit http://localhost:3000

## Documentation
<a href="https://documenter.getpostman.com/view/32107897/2s9YsFEZu5" target="_blank">Link to API document here</a>

## Contribution
| Member | Student ID | Role | Contribution (%) |
| ------ | ---------- | ---- | ---------------- |
| Dương Hoàng Anh | 21020603 | Backend | 20 |
| Vũ Hải Đăng | 21021479 | Backend | 16 |
| Đoàn Ngọc Long | 21020646 | Data | 16 |
| Phạm Nhật Minh | 21020651 | Documentation & Sildes | 16 |
| Phan Minh Phong | 21020657 | Frontend | 16 |
| Hoàng Quốc Đạt | 21020617 | Frontend | 16 |


