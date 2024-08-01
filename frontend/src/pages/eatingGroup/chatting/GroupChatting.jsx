import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../assets/style/GroupChatting.css';

const GroupChatting = () => {
    const { chatRoomId } = useParams();
    const [chatRoom, setChatRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchChatRoom = async () => {
            try {
                const response = await axios.get(`/api/chatrooms/${chatRoomId}`);
                setChatRoom(response.data);
            } catch (error) {
                console.error('Failed to fetch chat room', error);
            }
        };

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chatrooms/${chatRoomId}/messages`);
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages', error);
            }
        };

        fetchChatRoom();
        fetchMessages();
    }, [chatRoomId]);

    const handleSendMessage = async () => {
        try {
            const response = await axios.post(`/api/chatrooms/${chatRoomId}/messages`, {
                content: newMessage
            });
            setMessages([...messages, response.data]);
            setNewMessage("");
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    return (
        <div className="chatting">
            {chatRoom && (
                <div className="chat-room-info">
                    <h2>{chatRoom.chatRoomTitle}</h2>
                    <p>{chatRoom.description}</p>
                </div>
            )}
            <div className="messages">
                {messages.map(message => (
                    <div key={message.id} className="message">
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요"
                />
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
};

export default GroupChatting;
