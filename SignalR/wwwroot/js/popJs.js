$(document).ready(() => {
    const connection = new signalR
        .HubConnectionBuilder()
        .withUrl("https://localhost:7087/myhub")
        .withAutomaticReconnect(1000, 1000, 2000) // 0-2-10-30 Default
        .build();

    //Hiç Kurulmayan Bağlantıyı Sağlamak
    async function start() {
        try {
            await connection.start();
        } catch (error) {
            setTimeout(() => start(), 2000);
        }
    };
    //connection.start();
    start();

    const durum = $("#durum")
    connection.onreconnecting(error => {
        durum.css("background-color", "blue");
        durum.css("color", "white");
        durum.html("Bağlantı kuruluyor...")
        durum.fadeIn(2000, () => {
            setTimeout(() => {
                durum.fadeOut(2000);
            }, 2000)
        });
    });

    connection.onreconnected(connectionId => {
        durum.css("background-color", "green");
        durum.css("color", "white");
        durum.html("Bağlantı kuruldu")
        durum.fadeIn(2000, () => {
            setTimeout(() => {
                durum.fadeOut(2000);
            }, 2000)
        });
    });
    connection.onclose(connectionId => {
        durum.css("background-color", "red");
        durum.css("color", "white");
        durum.html("Bağlantı kurulamadı")
        durum.fadeIn(2000, () => {
            setTimeout(() => {
                durum.fadeOut(2000);
            }, 2000)
        });
    });

    $("#btnGonder").click(() => {
        let message = $("#txtMessage").val();
        connection.invoke("SendMessageAsync", message).catch(error => console.log(`Mesaj gönderilirken hata oluştu. ${error}`));
    });

    connection.on("receiveMessage", message => {
        $("#mesajlar").append(message + "<br>");
    });
});