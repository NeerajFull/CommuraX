import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getUserFriend } from "../lib/api";
import { Mic, Phone, Send, Video } from "lucide-react";
import Dropdown from "../components/Dropdown";
import Attachment from "../components/Attachment";
import EmojiPickerOpner from "../components/EmojiPickerOpener";
import Text from "../components/Text";
import { anotherAxiosInstance, axiosInstance } from "../lib/axios";
import socket from "../lib/socket";
import { formatMongoTimestamp } from "../lib/utils";


export default function ChatPage({ loggedInUserId }) {
  const { id: selectedUserId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Add user to socket connection
    socket.emit("add-user", loggedInUserId);
  }, [loggedInUserId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);



  useEffect(() => {
    // Fetch chat history between the two users
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `/messages/${loggedInUserId}/${selectedUserId}`
        );
        const formatted = res.data.map((msg) => ({
          fromSelf: msg.sender === loggedInUserId,
          content: msg.content,
          timestamp: msg.timestamp,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    if (loggedInUserId && selectedUserId) {
      fetchMessages();
    }
  }, [loggedInUserId, selectedUserId]);


  useEffect(() => {
    socket.on("receive-message", ({ senderId, content }) => {
      if (senderId === selectedUserId) {
        setMessages((prev) => [...prev, { fromSelf: false, content, timestamp: new Date() }]);
      }
    });

    return () => {
      socket.off("receive-message");
    };
  }, [selectedUserId]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit("send-message", {
      senderId: loggedInUserId,
      receiverId: selectedUserId,
      content: message,

    });

    setMessages((prev) => [...prev, { fromSelf: true, content: message, timestamp: new Date() }]);
    setMessage("");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["userFriend"],
    queryFn: () => getUserFriend(selectedUserId),
  });


  const handleMicClick = (e) => {
    e.preventDefault();
  }

  const handleVideoCall = async () => {
    try {
      const meetingLink = await anotherAxiosInstance.get("/create-meet");
      socket.emit("send-message", {
        senderId: loggedInUserId,
        receiverId: selectedUserId,
        content: meetingLink.data,
      });
      setMessages((prev) => [...prev, { fromSelf: true, content: meetingLink.data, timestamp: new Date() }]);
    } catch (error) {
      console.error("Error creating meeting:", error);
      window.open(`${anotherAxiosInstance.getUri()}/create-meet`, "_blank");
    }
  }


  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <div className={`flex h-full relative flex-col border-l border-stroke dark:border-strokedark overflow-hidden`}>
        {/* Chat Header */}
        <div className=" w-full flex items-center justify-between border-b bg-yellow-950 border-stroke dark:border-strokedark px-6 py-2">
          <div className="flex items-center gap-5">
            <div className="overflow-hidden rounded-full">
              <img src={data.profilePic} alt="avatar" className="object-cover object-center" width={50} height={50} />
            </div>

            <div>
              <h5 className="font-medium text-black dark:text-white">{data.fullName}</h5>
            </div>
          </div>

          <div className="flex items-center space-x-8">
            <button onClick={handleVideoCall}>
              <Video />
            </button>

            <button >
              <Phone />
            </button>

            <Dropdown />
          </div>
        </div>

        {/* list of messages */}
        <div className="flex flex-col px-6 py-3 gap-4 overflow-y-scroll h-[calc(100vh-190px)] whitespace-pre text-wrap">
          {messages.map((msg, index) => (
            <Text
              key={index}
              author={data.fullName}
              content={msg.content}
              incoming={!msg.fromSelf}
              timestamp={formatMongoTimestamp(msg.timestamp)}
            />
          ))}
          {/* <Text author={data.fullName} content={"Hi, there this is our first message. https://go.staging.setmore.com/integration"} incoming={true} timestamp={"2:44pm"} />
          <Text content={"Hi, there this is our first message."} incoming={false} timestamp={"2:44pm"} />
          <Text author={data.fullName} content={"Hi, there this is our first message."} incoming={true} timestamp={"2:44pm"} />
          <Text content={"Hi, there this is our first message."} incoming={false} timestamp={"2:44pm"} />
          <Text content={"Hi, there this is our first message."} incoming={false} timestamp={"2:44pm"} />
          <Text content={"Hi, there this is our first message."} incoming={false} timestamp={"2:44pm"} />
          <Text content={"Hi, there this is our first message."} incoming={false} timestamp={"2:44pm"} />
          <Text content={"Hi, there this is our first message."} incoming={false} timestamp={"2:44pm"} /> */}

          {/* <Document author={"Neeraj K"} content={"Hi, there this is our first message."} incoming={true} timestamp={"2:44pm"} />
          <Document author={"Avu"} content={"Hi, there this is our first message."} incoming={false} timestamp={"2:44pm"} /> */}
          {/* <Voice incoming={false} read_receipt={"delivered"} timestamp={"2:44pm"} /> */}

          {/* <Media caption={"this is a car"} author={"Neeraj K"} incoming={true} read_receipt={"delivered"} timestamp={"2:44pm"} assets={[]} /> */}

          {/* <TypingIndicator /> */}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="w-full px-6">
          <form className="flex items-center justify-between space-x-4">
            <div className="relative w-full">
              <textarea type="text" ref={inputRef} onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    sendMessage(e);
                  }
                }}

                value={message} 
                placeholder="Type something here" 
                className="resize-none h-14 w-full rounded-md border border-stroke bg-gray pl-5 pr-20 pt-3 text-black placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white" 
                ></textarea>

              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-end space-x-4">
                <button onClick={handleMicClick} className="hover:text-primary">
                  <Mic />
                </button>


                <Attachment />


                <EmojiPickerOpner setEmoji={setMessage} />
              </div>
            </div>

            <button onClick={sendMessage} className="flex h-14 max-w-14 w-full items-center justify-center rounded-md bg-primary text-white hover:bg-opacity-90">
              <Send />
            </button>
          </form>
        </div>
      </div>

      {/* {
        videoCall && <VideoRoom open={videoCall} handleClose={handleToggleVideoCall} />
      }
      {
        audioCall && <AudioRoom open={audioCall} handleClose={handleToggleAudioCall} />
      } */}

      {/* {
        userInfoOpen && (
          <div className="w-1/4">
            <UserInfo handleToggleUserInfo={handleToggleUserInfo} />
          </div>
        )
      } */}
    </>

  )
}