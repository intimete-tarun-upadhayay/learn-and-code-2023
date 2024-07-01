import PromptSync from "prompt-sync";
import { Socket } from "socket.io";
import { exit } from "process";

const prompt = PromptSync();

export default function handleChefMenuAction(io:Socket) {
    console.log(`
    1. Propose Daily Menu
    2. Generate Monthly Feedback Report
    3. View Feedback
    4. Exit
    `);
    // menuItemService = new MenuItemService(io);
    const adminAction = prompt("Choose Option from above : ");
    switch (adminAction) {
        case '1':
            proposeDailyMenuItem(io);
            break;
        case '2':
            // seeMenuItem(io);
            break;
        case '3':
            // updateMenuItem(io);
            break;
        case '4':
            exit();
        default:
            // This should never happen since `action` is of type `MenuAction`
            console.log('Unknown action');
            break;
    }
}


const proposeDailyMenuItem = (io:Socket) => {

}
