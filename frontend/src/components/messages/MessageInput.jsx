import { useState } from "react";
import { BsSend } from "react-icons/bs";
import { MdOutlineFileUpload } from 'react-icons/md';
import useSendMessage from "../../hooks/useSendMessage";
import toast from "react-hot-toast";

const MessageInput = () => {
    const [file, setFile] = useState(null);
	const [message, setMessage] = useState('');
	const {sendMessage, loading} =useSendMessage();

    const MAX_FILE_SIZE_KB = 100; // Maximum file size in KB
    const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_KB * 1024; // Convert KB to bytes

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

	const handleFileChange = (e)=>{
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
                toast.error('File size must be under 100KB.');
                return;
            }
            setMessage(selectedFile.name);
        }
	}

	const handleSubmit = async (e)=>{
		e.preventDefault();
        let base64String = '';
        if (file) {
            base64String = await convertToBase64(file);
        }

        const payload = {
            message: file ? '' : message, 
            file: base64String || ''
        };

        if (!payload.message && !payload.file) return;

        await sendMessage(payload.message, payload.file);
		setMessage('');
        setFile(null);
	}
	return (
		<form className='px-4 my-3' onSubmit={handleSubmit}>
            <div className='w-full relative'>
                <input
                    type='text'
                    className='border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Send a message'
                />
                <div className='absolute inset-y-0 end-0 flex items-center pe-3 space-x-2'>
                    <input
                        type='file'
                        id='file-upload'
                        style={{ display: 'none' }}
						onChange={handleFileChange}
                    />
                    <label htmlFor='file-upload' className='cursor-pointer'>
                        <MdOutlineFileUpload size={24} color='white' />
                    </label>
                    <button type='submit'>
                        {loading ? <div className='loading loading-spinner'></div> : <BsSend size={24} color='white' />}
                    </button>
                </div>
            </div>
        </form>
	);
};
export default MessageInput;
