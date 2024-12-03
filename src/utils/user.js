export default function getConnectedUser(){
    const connectedUserString = window.localStorage.getItem("connectedUser");
    if (connectedUserString) {
        const connectedUser = JSON.parse(connectedUserString);
        return {id : connectedUser._id, user: connectedUser};
    }
    return null;
}