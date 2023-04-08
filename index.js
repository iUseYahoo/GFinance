import {
    Extension,
    HPacket,
    HDirection,
} from "gnode-api";
import fs from "fs";

const extensionInfo = {
    name: "GFinance",
    description: "Logs all your purchases.",
    version: "1.0.0",
    author: "floppidity"
};

let ext = new Extension(extensionInfo);
ext.run();

function DisplayAlert(message) {
    ext.sendToClient(new HPacket(`{in:NotificationDialog}{s:""}{i:2}{s:"display"}{s:"BUBBLE"}{s:"message"}{s:"${message}"}`));
}

function LogPurchase(OfferId, ItemName) {
    const time = new Date().toLocaleString();
    // const RandomLogID = Math.floor(Math.random() * 1000000000);
    const log = `[${time}] ${ItemName} (${OfferId})\n`;

    console.log(log.replace("\n", ""));

    fs.appendFileSync("finance.txt", log);
}


ext.interceptByNameOrHash(HDirection.TOCLIENT, "PurchaseOK", hMsg => {
    // {in:PurchaseOK}{i:4258}{s:"ktchn_desk"}{i:0}{b:true}{i:0}{i:0}{b:true}{i:1}{s:"s"}{i:3260}{s:""}{i:1}{s:""}{i:1}{i:1}{i:795503711}{i:0}
    const packet = hMsg.getPacket();
    const OfferId = packet.readInteger();
    const ItemName = packet.readString();

    LogPurchase(OfferId, ItemName);
})

ext.on("connect", () => {
    DisplayAlert("GFinance loaded!\n");
})