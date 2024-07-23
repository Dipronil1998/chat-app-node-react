import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import SendNotification from "../components/notification/SendNotification";


const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();
	const {authUser} = useAuthContext();

	

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			
			newMessage.newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			if(newMessage?.receiverId == authUser?.response?._id){
				SendNotification(newMessage?.name, newMessage?.newMessage?.message,newMessage?.profilePic);
			}
			setMessages([...messages, newMessage.newMessage]);
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;