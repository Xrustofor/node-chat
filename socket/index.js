module.exports = class Chat {
    publicMessage = [];
    privateMessage = [];
    users = [];

    getUsers() {
        return this.users;
    }
    addUser(user){
        const candidate = this.users.find(item => item.socket_id === user.socket_id);
        if(!candidate){
            this.users.push(user);
        }   
    }
    addUserData(user){
        console.log('addUserData: ', user);
    }
    deleteUser(socket_id){
        this.users = this.users.filter(item => item.socket_id !== socket_id);
        console.log(this.users);
    }
    get publicMessage(){
        return this.publicMessage;
    }
    set publicMessage(user){
        this.publicMessage.push(user);
    }
}
