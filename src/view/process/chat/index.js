import React, { useState, useRef, useEffect } from 'react';
import { IconButton, Input, Button } from 'rsuite';

import CloseIcon from '@rsuite/icons/Close';
import SendIcon from '@rsuite/icons/Send';
import useSnackbarAlert from 'customHook/alert';
import useAuth from 'customHook/useAuth';
import DocumentPreviewer from '../../../componets/DocumentPreviewer';
import theme from '../../../componets/Theme';

// api
import { getRoomIdForTask, getChat, createChat } from 'api/chat/chatApi';

// constants
import { fontFamily } from 'constant/constant';

const Chat = ({ selectedTask, onClose }) => {
    const { user, clientIdForAdmin } = useAuth();
    const { openTostar, SnackbarComponent } = useSnackbarAlert();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [roomId, setRoomId] = useState(null);
    const messagesContainerRef = useRef(null);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();

        const isToday = date.toDateString() === now.toDateString();

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.toDateString() === yesterday.toDateString();

        const timeString = date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });

        if (isToday) {
            return `Today, ${timeString}`;
        } else if (isYesterday) {
            return `Yesterday, ${timeString}`;
        } else {
            const dateString = date.toLocaleDateString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            return `${dateString}, ${timeString}`;
        }
    };

    // Scroll to bottom
    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    // Fetch chat list
    const fetchChatList = async () => {
        try {
            const response = await getChat({ room_id: roomId, clientId: user.clientId || clientIdForAdmin });
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setMessages(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch or create room ID
    const fetchRoomId = async () => {
        try {
            const response = await getRoomIdForTask({ task_id: selectedTask?.id, clientId: user.clientId || clientIdForAdmin });
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setRoomId(response.roomId);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim() || !roomId) return;

        try {
            const data = {
                roomId,
                message: newMessage,
                type: 'text',
                userId: user.id,
                clientId: user.clientId || clientIdForAdmin
            };

            const response = await createChat(data);
            if (typeof response === 'string') {
                openTostar(response, 'error');
            } else {
                setNewMessage('');
                fetchChatList();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (selectedTask?.id) {
            fetchRoomId();
        }
    }, [selectedTask]);

    useEffect(() => {
        if (roomId) {
            fetchChatList();
        }
    }, [roomId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const isOwn = (msg) => msg.userId === user?.id;

    return (
        <>
            <SnackbarComponent />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '80vh',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                <div
                    style={{
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: `2px solid #d0cfcfff`
                    }}
                >
                    <h5 style={{ margin: 0, fontFamily }}>Group Chat — {selectedTask?.taskNumber}</h5>
                    <IconButton appearance="subtle" icon={<CloseIcon />} onClick={onClose} />
                </div>

                {/* Messages */}
                <div
                    ref={messagesContainerRef}
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '20px',
                        backgroundImage: ` linear-gradient(rgba(251, 247, 247, 0.5), rgba(255, 255, 255, 0.5)),url('/assets/chat-bg-image.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        display: 'flex',
                        flexDirection: 'column',
                        color: 'white',
                        width: '50vw'
                    }}
                >

                    {messages?.length === 0 ? (
                        <div
                            style={{
                                textAlign: 'center',
                                color: '#999',
                                padding: '40px 20px',
                                fontStyle: 'italic',
                                width: '50vw'
                            }}
                        >
                            No messages yet. Start the conversation!
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div
                                key={msg.id || index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: isOwn(msg) ? 'flex-end' : 'flex-start',
                                    marginBottom: '16px',
                                    padding: '0 10px'
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        marginBottom: '4px',
                                        opacity: 0.9,
                                        color: 'black',
                                        fontFamily
                                    }}
                                >
                                    {msg.userName}
                                </div>
                                <div
                                    style={{
                                        maxWidth: '70%',
                                        display: 'flex',
                                        flexDirection: isOwn(msg) ? 'row-reverse' : 'row',
                                        gap: '8px'
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '12px 16px',
                                            background: isOwn(msg) ? theme.palette?.secondary?.main : '#fff',
                                            color: isOwn(msg) ? '#ffffffff' : '#000',
                                            borderRadius: isOwn(msg) ? '18px 0px 18px 18px' : '0px 18px 18px 18px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            fontFamily,
                                            fontSize: '14px',
                                            lineHeight: '1.4',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        <DocumentPreviewer msg={msg} />
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: '11px',
                                        opacity: 0.6,
                                        color: '#2a5d77ff',
                                        alignSelf: isOwn(msg) ? 'flex-end' : 'flex-start',
                                        marginTop: '2px',
                                        padding: '0 10px'
                                    }}
                                >
                                    {formatTime(msg.createdAt)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div
                    style={{
                        padding: '20px 12px',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        flexShrink: 0,
                        borderTop: `1px solid #d0cfcfff`
                    }}
                >
                    <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        style={{
                            flex: 1,
                            fontFamily,
                            borderRadius: 16
                        }}
                        onChange={(value) => setNewMessage(value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    />
                    <Button
                        appearance="primary"
                        onClick={sendMessage}
                        style={{
                            backgroundColor: theme.palette?.primary?.main,
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            fontFamily,
                            borderRadius: 999
                        }}
                    >
                        <SendIcon size="20px" style={{ marginRight: 4 }} />
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Chat;
