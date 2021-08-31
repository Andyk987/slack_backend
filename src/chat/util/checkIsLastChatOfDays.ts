import { Chat } from '../entities/chat.entity';

const date = {
  getDay: (timeStamp: Date) => {
    return new Date(timeStamp).getDay();
  },
};

export const checkIsLastChatOfDays = (chats: Chat[]) => {
  const lessThan11 = chats.length < 11 ? true : false;

  chats.map((chat: any, index: number) => {
    if (index === chats.length - 1)
      return (chats[index] = { ...chat, isLastChatOfDay: lessThan11 });

    const currDay = date.getDay(chat.timeStamp);
    const nextDay = date.getDay(chats[index + 1].timeStamp);
    return (chats[index] = { ...chat, isLastChatOfDay: currDay !== nextDay });
  });
  return chats;
};
