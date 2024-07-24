import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";
import { useAuthContext } from "../context/AuthContext";
import SendNotification from "../components/notification/SendNotification";
import useGetConversations from "./useGetConversations";


const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages } = useConversation();
	const {authUser} = useAuthContext();
	const { selectedConversation,setSelectedConversation } = useConversation();
	const { conversations } = useGetConversations();

	const handleNotificationClick = (senderId) => {
		const conversation = conversations.response.find((c) => c._id.includes(senderId));
		if(conversation){
			setSelectedConversation(conversation);
		}
	  };

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();
			if(newMessage?.receiverId == authUser?.response?._id){
				SendNotification(newMessage?.name, newMessage?.newMessage?.message,newMessage?.profilePic,() => handleNotificationClick(newMessage?.newMessage?.senderId));
			}
			if(newMessage?.newMessage?.senderId === selectedConversation._id){
				setMessages([...messages, newMessage.newMessage]);
			}
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);
};
export default useListenMessages;