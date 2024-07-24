import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import moment from "moment";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();
	const [lastSeen, setLastSeen] = useState(moment(selectedConversation?.lastSeen).fromNow());
	const isOnline = onlineUsers.includes(selectedConversation?._id);

	useEffect(() => {
		if (selectedConversation) {
			setLastSeen(moment(selectedConversation.lastSeen).fromNow());
		}
	}, [selectedConversation]);

	useEffect(() => {
		const handleUserLogout = (userId) => {
			if (userId === selectedConversation?._id) {
				setLastSeen(moment().fromNow());
			}
		};

		const eventEmitter = {
			on: (event, handler) => {
				if (event === "userLogout") {
					setTimeout(() => handler(selectedConversation?._id), 5000); 
				}
			},
			off: () => {},
		};

		eventEmitter.on("userLogout", handleUserLogout);

		return () => eventEmitter.off("userLogout", handleUserLogout);
	}, [selectedConversation]);

	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className='md:min-w-[450px] flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					<div className="bg-slate-500 p-4 mb-2 rounded-md shadow-md">
						<div className="flex justify-between items-center">
							<div>
								<span className="label-text text-gray-200">To:</span>
								<span className="text-white font-bold ml-2">{selectedConversation.fullName}</span>
							</div>
							{!isOnline ? (
								<div>
									<span className="label-text text-gray-200">Last seen:</span>
									<span className="text-white font-bold ml-2">{lastSeen}</span>
								</div>
							) : (
								<div>
									<span className="label-text text-gray-200">Status:</span>
									<span className="text-white font-bold ml-2">Online</span>
								</div>
							)}
						</div>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome 👋 {authUser?.response?.fullName} ❄</p>
				<p>Select a chat to start messaging</p>
				<TiMessages className='text-3xl md:text-6xl text-center' />
			</div>
		</div>
	);
};
