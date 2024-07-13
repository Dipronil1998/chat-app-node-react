// import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
// import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {
	// const { authUser } = useAuthContext();
	// const { selectedConversation } = useConversation();
	// const fromMe = message.senderId === authUser._id;
    const fromMe = true;
	// const formattedTime = extractTime(message.createdAt);
    const formattedTime = extractTime(new Date());
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	// const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
    const profilePic = fromMe ? "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.webp?s=1024x1024&w=is&k=20&c=6XEZlH2FjqdpXUqjUK4y0LlWF6yViZVWn9HZJ-IR8gU=": selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	// const shakeClass = message.shouldShake ? "shake" : "";
    const shakeClass = "shake";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>Message</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;
