import { Feather } from "@expo/vector-icons";

export const icon = {
    index: (props: any) => <Feather name='home' size={24} {...props}/>,
    livetv: (props: any) => <Feather name='tv' size={24} {...props}/>,
    store: (props: any) => <Feather name='shopping-bag' size={24} {...props}/>,
    profile: (props: any) => <Feather name='user' size={24} {...props}/>,
    testimony: (props: any) => <Feather name='message-circle' size={24} {...props}/>
}