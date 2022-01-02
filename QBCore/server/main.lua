QBCore = nil

TriggerEvent(
    "QBCore:GetObject",
    function(obj)
        QBCore = obj
    end
)

AddEventHandler(
    "QBCore:Client:OnPlayerLoaded",
    function(playerId, xPlayer)
        local sourcePlayer = playerId
        local identifier = xPlayer.PlayerData.citizenid()
    end
)

local MIPhone = {}
local Tweets = {}
local AppAlerts = {}
local MentionedTweets = {}
local Hashtags = {}
local Calls = {}
local Adverts = {}
local GeneratedPlates = {}
local EMS_Bildirimleri = {}

RegisterServerEvent("s4-phone:saveTwitterToDatabase")
AddEventHandler(
    "s4-phone:saveTwitterToDatabase",
    function(firstName, lastname, message, url, time, picture)
        local xPlayer = QBCore.Functions.GetPlayer(source)

        exports.ghmattimysql:execute(
            "INSERT INTO twitter_tweets (firstname, lastname, message, url, time, picture, owner) VALUES (@firstname, @lastname, @message, @url, @time, @picture, @owner)",
            {
                ["@firstname"] = firstName,
                ["@lastname"] = lastname,
                ["@message"] = message,
                ["@url"] = url,
                ["@time"] = time,
                ["@picture"] = picture,
                ["@owner"] = xPlayer.PlayerData.citizenid
            }
        )
    end
)

RegisterServerEvent("s4-phone:server:EmsSinyal")
AddEventHandler("s4-phone:server:EmsSinyal", function(x)
        EMS_Bildirimleri[#EMS_Bildirimleri + 1] = {x = tonumber(x.x), y = tonumber(x.y)}

        for k, v in pairs(QBCore.Functions.GetPlayers()) do
            local Player = QBCore.Functions.GetPlayer(v)
            if Player ~= nil then
                if Player.PlayerData.job.name == Config.Meslekler.doktor then
                    TriggerClientEvent('QBCore:Notify', v, "Birilerinin Yardıma İhtiyacı Var! Telefonunuzu Kontrol Edin!", "error")
                end
            end
        end
    end
)

RegisterServerEvent("s4-phone:server:s4share")
AddEventHandler(
    "s4-phone:server:s4share",
    function(b)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        if b then
            b = 1
        else
            b = 0
        end
        ExecuteSql(
            false,
            'UPDATE `players` SET `bt` = "' .. b .. '" WHERE  `citizenid` = "' .. xPlayer.PlayerData.citizenid .. '"'
        )
    end
)

RegisterServerEvent("s4-phone:telver")
AddEventHandler(
    "s4-phone:telver",
    function()
        local xPlayer = QBCore.Functions.GetPlayer(source)
        TriggerClientEvent("inventory:client:ItemBox", source, QBCore.Shared.Items["phone"], "add", 1)

        local player =
            exports.ghmattimysql:executeSync(
            "SELECT * FROM players WHERE citizenid ='" .. xPlayer.PlayerData.citizenid .. "'  ",
            {}
        )
        if player[1] then
            xPlayer.Functions.AddItem(
                "phone",
                1,
                false,
                {
                    isim = xPlayer.PlayerData.charinfo.firstname .. " " .. xPlayer.PlayerData.charinfo.lastname,
                    telno = xPlayer.PlayerData.charinfo.phone,
                    aitlik = xPlayer.PlayerData.citizenid,
                    durum = "kilitli"
                }
            )
        end
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetirVerilecekTelefon",
    function(source, cb)
        local bilgi = {}
        local xPlayer = QBCore.Functions.GetPlayer(source)

        local player =
            exports.ghmattimysql:executeSync(
            "SELECT * FROM players WHERE citizenid ='" .. xPlayer.PlayerData.citizenid .. "'  ",
            {}
        )
        if player[1] then
            --xPlayer.Functions.AddItem("phone", 1, false, { isim = player[1].firstname.." "..player[1].lastname,  telno = player[1].phone , aitlik =  xPlayer.PlayerData.citizenid, durum = 'kilitli'   })
            bilgi = {
                isim = xPlayer.PlayerData.charinfo.firstname,
                telno = xPlayer.PlayerData.charinfo.phone,
                aitlik = xPlayer.PlayerData.citizenid,
                durum = "kilitli"
            }
        end

        cb(bilgi)
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GETEMS",
    function(source, cb)
        cb(EMS_Bildirimleri)
    end
)

RegisterServerEvent("s4-phone:server:DosyaGonder")
AddEventHandler(
    "s4-phone:server:DosyaGonder",
    function(veri)
        TriggerClientEvent("s4-phone:client:DosyaAl", veri.src, veri)
    end
)

RegisterServerEvent("s4-phone:server:DosyaKaydet")
AddEventHandler(
    "s4-phone:server:DosyaKaydet",
    function(veri)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        local player =
            exports.ghmattimysql:executeSync("SELECT * FROM `s4_gallery` WHERE id ='" .. veri.resim_url .. "'  ", {})
        if player[1].resim then
            ExecuteSql(
                false,
                "INSERT INTO `s4_gallery` (`identifier`, `resim`) VALUES ('" ..
                    xPlayer.PlayerData.citizenid .. "', '" .. player[1].resim .. "' )"
            )
        end
    end
)

RegisterNetEvent("s4-phone:server:PayBilling")
AddEventHandler(
    "s4-phone:server:PayBilling",
    function(faturaid)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        local faturaid = faturaid
        local billing_data =
            exports.ghmattimysql:executeSync("SELECT * FROM billing WHERE id='" .. faturaid .. "' ", {})
        if billing_data[1].amount < xPlayer.PlayerData.money["bank"] then
            xPlayer.Functions.RemoveMoney("bank", billing_data[1].amount)
            exports.ghmattimysql:executeSync("DELETE FROM billing WHERE id='" .. faturaid .. "'  ", {})
        -- exports.ghmattimysql:execute("INSERT INTO s4_bank (islem, owner, ucret) VALUES ('Fatura ödendi -> "..faturaid.." ', '"..xPlayer.PlayerData.citizenid.."', '"..billing_data[1].amount.."')" , {})
        end
    end
)

RegisterServerEvent("s4-phone:sifrekirtelefon")
AddEventHandler(
    "s4-phone:sifrekirtelefon",
    function(slot)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        local inv = xPlayer.getInventory(true)
        for i = 1, #inv, 1 do
            if inv[i].slot == slot then
                local kr_info = {}
                kr_info.isim = inv[i].info.isim
                kr_info.telno = inv[i].info.telno
                kr_info.aitlik = inv[i].info.aitlik
                kr_info.durum = "1"
                xPlayer.Functions.AddItem("phone", 1, false, kr_info)
                xPlayer.Functions.RemoveItem("phone", 1, slot)
                break
            end
        end
    end
)

RegisterServerEvent("s4-phone:server:AddAdvert")
AddEventHandler(
    "s4-phone:server:AddAdvert",
    function(msg, foto)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)
        local Identifier = Player.PlayerData.citizenid
        local username = "@" .. Player.PlayerData.charinfo.firstname .. " " .. Player.PlayerData.charinfo.lastname
        local number = Player.PlayerData.charinfo.phone

        if foto then
            ExecuteSql(
                false,
                "INSERT INTO `s4_yellowpages` (`owner`, `mesaj`, `isim`, `telno`, `resim`) VALUES ('" ..
                    Player.PlayerData.citizenid ..
                        "', '" .. msg .. "', '" .. username .. "' , '" .. number .. "' , '" .. foto .. "' )"
            )
        else
            ExecuteSql(
                false,
                "INSERT INTO `s4_yellowpages` (`owner`, `mesaj`, `isim`, `telno` ) VALUES ('" ..
                    Player.PlayerData.citizenid .. "', '" .. msg .. "', '" .. username .. "' , '" .. number .. "'  )"
            )
        end
        -- TriggerClientEvent('s4-phone:client:UpdateAdverts', -1, Adverts, "@" .. character.firstname .. "" .. character.lastname)
    end
)

function GetOnlineStatus(number)
    local Target = GetPlayerFromPhone(number)
    local retval = false
    if Target ~= nil then
        retval = true
    end
    return retval
end

RegisterServerEvent("s4-phone:server:updateForEveryone")
AddEventHandler(
    "s4-phone:server:updateForEveryone",
    function(newTweet)
        local src = source
        TriggerClientEvent("s4-phone:updateForEveryone", -1, newTweet)
    end
)

RegisterServerEvent("s4-phone:server:updateidForEveryone")
AddEventHandler(
    "s4-phone:server:updateidForEveryone",
    function()
        TriggerClientEvent("s4-phone:updateidForEveryone", -1)
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetPhoneData",
    function(source, cb, idf)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)

        if not idf then
            idf = Player.PlayerData.citizenid
        end
        local character = GetCharacter(src)

        if Player ~= nil then
            local PhoneData = {
                Applications = {},
                PlayerContacts = {},
                MentionedTweets = {},
                Chats = {},
                Hashtags = {},
                SelfTweets = {},
                Invoices = {},
                Garage = {},
                Mails = {},
                Adverts = {},
                CryptoTransactions = {},
                Tweets = {}
            }
            PhoneData.Adverts = Adverts

            ExecuteSql(
                false,
                "SELECT * FROM player_contacts WHERE `citizenid` = '" .. idf .. "' ORDER BY `name` ASC",
                function(result)
                    local Contacts = {}
                    if result[1] ~= nil then
                        for k, v in pairs(result) do
                            v.status = GetOnlineStatus(v.number)
                        end

                        PhoneData.PlayerContacts = result
                    end

                    ExecuteSql(
                        false,
                        "SELECT * FROM twitter_tweets",
                        function(result)
                            if result[1] ~= nil then
                                PhoneData.Tweets = result
                            else
                                PhoneData.Tweets = nil
                            end

                            ExecuteSql(
                                false,
                                "SELECT * FROM twitter_tweets WHERE owner = '" .. idf .. "'",
                                function(result)
                                    if result ~= nil then
                                        PhoneData.SelfTweets = result
                                    end
                                    ExecuteSql(
                                        false,
                                        "SELECT * FROM player_vehicles WHERE `citizenid` = '" .. idf .. "'",
                                        function(garageresult)
                                            if garageresult[1] ~= nil then
                                                PhoneData.Garage = garageresult
                                            end

                                            ExecuteSql(
                                                false,
                                                'SELECT * FROM `player_mails` WHERE `identifier` = "' ..
                                                    idf .. '" ORDER BY `date` ASC',
                                                function(mails)
                                                    if mails[1] ~= nil then
                                                        for k, v in pairs(mails) do
                                                            if mails[k].button ~= nil then
                                                                mails[k].button = json.decode(mails[k].button)
                                                            end
                                                        end
                                                        PhoneData.Mails = mails
                                                    end

                                                    ExecuteSql(
                                                        false,
                                                        "SELECT * FROM phone_messages WHERE `citizenid` = '" ..
                                                            idf .. "'",
                                                        function(messages)
                                                            if messages ~= nil and next(messages) ~= nil then
                                                                PhoneData.Chats = messages
                                                            end

                                                            if AppAlerts[Player.PlayerData.citizenid] ~= nil then
                                                                PhoneData.Applications =
                                                                    AppAlerts[Player.PlayerData.citizenid]
                                                            end

                                                            if MentionedTweets[Player.PlayerData.citizenid] ~= nil then
                                                                PhoneData.MentionedTweets =
                                                                    MentionedTweets[Player.PlayerData.citizenid]
                                                            end

                                                            if Hashtags ~= nil and next(Hashtags) ~= nil then
                                                                PhoneData.Hashtags = Hashtags
                                                            end

                                                            if Config.UseESXBilling then
                                                                ExecuteSql(
                                                                    false,
                                                                    "SELECT * FROM billing  WHERE `identifier` = '" ..
                                                                        idf .. "'",
                                                                    function(invoices)
                                                                        if invoices[1] ~= nil then
                                                                            for k, v in pairs(invoices) do
                                                                                local Ply =
                                                                                    QBCore.Functions.GetPlayerByCitizenId(
                                                                                    v.sender
                                                                                )
                                                                                if Ply ~= nil then
                                                                                    v.number =
                                                                                        Ply.PlayerData.charinfo.phone
                                                                                else
                                                                                    ExecuteSql(
                                                                                        true,
                                                                                        "SELECT * FROM `players` WHERE `citizenid` = '" ..
                                                                                            v.sender .. "'",
                                                                                        function(res)
                                                                                            if res[1] ~= nil then
                                                                                                res[1].charinfo =
                                                                                                    json.decode(
                                                                                                    res[1].charinfo
                                                                                                )
                                                                                                v.number =
                                                                                                    res[1].charinfo.phone
                                                                                            else
                                                                                                v.number = nil
                                                                                            end
                                                                                        end
                                                                                    )
                                                                                end
                                                                            end
                                                                            PhoneData.Invoices = invoices
                                                                        end
                                                                        cb(PhoneData)
                                                                    end
                                                                )
                                                            else
                                                                PhoneData.Invoices = {}
                                                                cb(PhoneData)
                                                            end
                                                        end
                                                    )
                                                end
                                            )
                                        end
                                    )
                                end
                            )
                        end
                    )
                end
            )
        end
    end
)

RegisterServerEvent("s4-phone:deleteTweet")
AddEventHandler(
    "s4-phone:deleteTweet",
    function(id)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        exports.ghmattimysql:execute(
            "DELETE FROM twitter_tweets WHERE owner = @owner AND id = @id",
            {["@owner"] = xPlayer.PlayerData.citizenid, ["@id"] = id}
        )
    end
)

RegisterServerEvent("s4-phone:server:kaydetResim")
AddEventHandler(
    "s4-phone:server:kaydetResim",
    function(resim)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        ExecuteSql(
            false,
            "INSERT INTO `s4_gallery` (`identifier`, `resim`) VALUES ('" ..
                xPlayer.PlayerData.citizenid .. "', '" .. resim .. "' )"
        )
    end
)

RegisterServerEvent("s4-phone:server:PaylasInstaPost")
AddEventHandler(
    "s4-phone:server:PaylasInstaPost",
    function(id, efekt, yazi)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        ExecuteSql(
            false,
            "SELECT * FROM `s4_gallery` WHERE `identifier` = '" ..
                xPlayer.PlayerData.citizenid .. "' AND `id` = '" .. id .. "' ",
            function(result)
                if result[1] ~= nil then
                    ExecuteSql(
                        false,
                        "INSERT INTO `s4_instagram_postlar` (`owner`, `foto`, `efekt`, `yazi`) VALUES ('" ..
                            xPlayer.PlayerData.citizenid ..
                                "', '" .. result[1].resim .. "' , '" .. efekt .. "' , '" .. yazi .. "' )"
                    )
                end
            end
        )
    end
)

RegisterServerEvent("s4-phone:server:SilResim")
AddEventHandler(
    "s4-phone:server:SilResim",
    function(resim)
        local Player = QBCore.Functions.GetPlayer(source)
        exports.ghmattimysql:execute(
            "DELETE FROM s4_gallery WHERE identifier = @identifier AND id = @resim",
            {["@identifier"] = xPlayer.PlayerData.citizenid, ["@resim"] = resim}
        )
    end
)

RegisterServerEvent("s4-phone:server:ResimSilinsta")
AddEventHandler(
    "s4-phone:server:ResimSilinsta",
    function(resim)
        local Player = QBCore.Functions.GetPlayer(source)
        exports.ghmattimysql:execute(
            "DELETE FROM s4_instagram_postlar WHERE owner = @identifier AND id = @resim",
            {["@identifier"] = xPlayer.PlayerData.citizenid, ["@resim"] = resim}
        )
    end
)

RegisterServerEvent("s4-phone:server:NotEkle")
AddEventHandler(
    "s4-phone:server:NotEkle",
    function(baslik, aciklama)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        ExecuteSql(
            false,
            "INSERT INTO `s4_not` (`identifier`, `baslik`, `aciklama`) VALUES ('" ..
                xPlayer.PlayerData.citizenid .. "', '" .. baslik .. "', '" .. aciklama .. "' )"
        )
    end
)

RegisterServerEvent("s4-phone:server:NotGuncelle")
AddEventHandler(
    "s4-phone:server:NotGuncelle",
    function(id, baslik, aciklama)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        ExecuteSql(
            false,
            'UPDATE `s4_not` SET `baslik` = "' ..
                baslik ..
                    '", `aciklama` = "' ..
                        aciklama ..
                            '" WHERE `id` = "' .. id .. '" AND `identifier` = "' .. xPlayer.PlayerData.citizenid .. '"'
        )
        --ExecuteSql(false, "INSERT INTO `s4_not` (`identifier`, `resim`) VALUES ('"..xPlayer.PlayerData.citizenid.."', '"..resim.."' )")
    end
)

RegisterServerEvent("s4-phone:server:biyoguncelle")
AddEventHandler(
    "s4-phone:server:biyoguncelle",
    function(biyografi)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        ExecuteSql(
            false,
            'UPDATE `players` SET `biyografi` = "' ..
                biyografi .. '" WHERE  `citizenid` = "' .. xPlayer.PlayerData.citizenid .. '"'
        )
    end
)

RegisterServerEvent("s4-phone:server:NotSil")
AddEventHandler(
    "s4-phone:server:NotSil",
    function(id)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        ExecuteSql(
            false,
            'DELETE FROM `s4_not` WHERE `id` = "' ..
                id .. '" AND `identifier` = "' .. xPlayer.PlayerData.citizenid .. '"'
        )
    end
)

RegisterServerEvent("s4-phone:server:Takip_instagram")
AddEventHandler(
    "s4-phone:server:Takip_instagram",
    function(takip, takip_edilen)
        local xPlayer = QBCore.Functions.GetPlayer(source)

        if takip == "1" then
            ExecuteSql(
                false,
                "INSERT INTO `s4_instagram_takip` (`takip_eden`, `takip_edilen`) VALUES ('" ..
                    xPlayer.PlayerData.citizenid .. "', '" .. takip_edilen .. "' )"
            )
        else
            ExecuteSql(
                false,
                'DELETE FROM `s4_instagram_takip` WHERE `takip_edilen` = "' ..
                    takip_edilen .. '" AND `takip_eden` = "' .. xPlayer.PlayerData.citizenid .. '"'
            )
        end
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetCallState",
    function(source, cb, ContactData)
        local Target = GetPlayerFromPhone(ContactData.number)

        if Target ~= nil then
            if Calls[Target.citizenid] ~= nil then
                if Calls[Target.citizenid].inCall then
                    cb(false, true)
                else
                    cb(true, true)
                end
            else
                cb(true, true)
            end
        else
            cb(false, false)
        end
    end
)

RegisterServerEvent("s4-phone:server:SetCallState")
AddEventHandler(
    "s4-phone:server:SetCallState",
    function(bool)
        local src = source
        local Ply = QBCore.Functions.GetPlayer(src)

        if Calls[Ply.identifier] ~= nil then
            Calls[Ply.identifier].inCall = bool
        else
            Calls[Ply.identifier] = {}
            Calls[Ply.identifier].inCall = bool
        end
    end
)

RegisterServerEvent("s4-phone:server:RemoveMail")
AddEventHandler(
    "s4-phone:server:RemoveMail",
    function(MailId)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)

        ExecuteSql(
            false,
            'DELETE FROM `player_mails` WHERE `mailid` = "' ..
                MailId .. '" AND `identifier` = "' .. Player.PlayerData.citizenid .. '"'
        )
        SetTimeout(
            100,
            function()
                ExecuteSql(
                    false,
                    'SELECT * FROM `player_mails` WHERE `identifier` = "' ..
                        Player.PlayerData.citizenid .. '" ORDER BY `date` ASC',
                    function(mails)
                        if mails[1] ~= nil then
                            for k, v in pairs(mails) do
                                if mails[k].button ~= nil then
                                    mails[k].button = json.decode(mails[k].button)
                                end
                            end
                        end

                        TriggerClientEvent("s4-phone:client:UpdateMails", src, mails)
                    end
                )
            end
        )
    end
)

function GenerateMailId()
    return math.random(111111, 999999)
end

RegisterServerEvent("s4-phone:server:sendNewMail")
AddEventHandler(
    "s4-phone:server:sendNewMail",
    function(mailData)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)

        if mailData.button == nil then
            ExecuteSql(
                false,
                "INSERT INTO `player_mails` (`identifier`, `sender`, `subject`, `message`, `mailid`, `read`) VALUES ('" ..
                    Player.PlayerData.citizenid ..
                        "', '" ..
                            mailData.sender ..
                                "', '" ..
                                    mailData.subject ..
                                        "', '" .. mailData.message .. "', '" .. GenerateMailId() .. "', '0')"
            )
        else
            ExecuteSql(
                false,
                "INSERT INTO `player_mails` (`identifier`, `sender`, `subject`, `message`, `mailid`, `read`, `button`) VALUES ('" ..
                    Player.PlayerData.citizenid ..
                        "', '" ..
                            mailData.sender ..
                                "', '" ..
                                    mailData.subject ..
                                        "', '" ..
                                            mailData.message ..
                                                "', '" ..
                                                    GenerateMailId() ..
                                                        "', '0', '" .. json.encode(mailData.button) .. "')"
            )
        end
        TriggerClientEvent("s4-phone:client:NewMailNotify", src, mailData)

        SetTimeout(
            200,
            function()
                ExecuteSql(
                    false,
                    'SELECT * FROM `player_mails` WHERE `identifier` = "' ..
                        Player.PlayerData.citizenid .. '" ORDER BY `date` DESC',
                    function(mails)
                        if mails[1] ~= nil then
                            for k, v in pairs(mails) do
                                if mails[k].button ~= nil then
                                    mails[k].button = json.decode(mails[k].button)
                                end
                            end
                        end

                        TriggerClientEvent("s4-phone:client:UpdateMails", src, mails)
                    end
                )
            end
        )
    end
)

RegisterServerEvent("s4-phone:server:sendNewMailToOffline")
AddEventHandler(
    "s4-phone:server:sendNewMailToOffline",
    function(steam, mailData)
        local Player = QBCore.Functions.GetPlayerByCitizenId(steam)

        if Player ~= nil then
            local src = Player.source

            if mailData.button == nil then
                ExecuteSql(
                    false,
                    "INSERT INTO `player_mails` (`identifier`, `sender`, `subject`, `message`, `mailid`, `read`) VALUES ('" ..
                        Player.PlayerData.citizenid ..
                            "', '" ..
                                mailData.sender ..
                                    "', '" ..
                                        mailData.subject ..
                                            "', '" .. mailData.message .. "', '" .. GenerateMailId() .. "', '0')"
                )
                TriggerClientEvent("s4-phone:client:NewMailNotify", src, mailData)
            else
                ExecuteSql(
                    false,
                    "INSERT INTO `player_mails` (`identifier`, `sender`, `subject`, `message`, `mailid`, `read`, `button`) VALUES ('" ..
                        Player.PlayerData.citizenid ..
                            "', '" ..
                                mailData.sender ..
                                    "', '" ..
                                        mailData.subject ..
                                            "', '" ..
                                                mailData.message ..
                                                    "', '" ..
                                                        GenerateMailId() ..
                                                            "', '0', '" .. json.encode(mailData.button) .. "')"
                )
                TriggerClientEvent("s4-phone:client:NewMailNotify", src, mailData)
            end

            SetTimeout(
                200,
                function()
                    ExecuteSql(
                        false,
                        'SELECT * FROM `player_mails` WHERE `identifier` = "' ..
                            Player.PlayerData.citizenid .. '" ORDER BY `date` DESC',
                        function(mails)
                            if mails[1] ~= nil then
                                for k, v in pairs(mails) do
                                    if mails[k].button ~= nil then
                                        mails[k].button = json.decode(mails[k].button)
                                    end
                                end
                            end

                            TriggerClientEvent("s4-phone:client:UpdateMails", src, mails)
                        end
                    )
                end
            )
        else
            if mailData.button == nil then
                ExecuteSql(
                    false,
                    "INSERT INTO `player_mails` (`identifier`, `sender`, `subject`, `message`, `mailid`, `read`) VALUES ('" ..
                        identifier ..
                            "', '" ..
                                mailData.sender ..
                                    "', '" ..
                                        mailData.subject ..
                                            "', '" .. mailData.message .. "', '" .. GenerateMailId() .. "', '0')"
                )
            else
                ExecuteSql(
                    false,
                    "INSERT INTO `player_mails` (`identifier`, `sender`, `subject`, `message`, `mailid`, `read`, `button`) VALUES ('" ..
                        identifier ..
                            "', '" ..
                                mailData.sender ..
                                    "', '" ..
                                        mailData.subject ..
                                            "', '" ..
                                                mailData.message ..
                                                    "', '" ..
                                                        GenerateMailId() ..
                                                            "', '0', '" .. json.encode(mailData.button) .. "')"
                )
            end
        end
    end
)

RegisterServerEvent("s4-phone:server:sendNewEventMail")
AddEventHandler(
    "s4-phone:server:sendNewEventMail",
    function(steam, mailData)
        if mailData.button == nil then
            ExecuteSql(
                false,
                "INSERT INTO `player_mails` (`identifier`, `sender`, `subject`, `message`, `mailid`, `read`) VALUES ('" ..
                    identifier ..
                        "', '" ..
                            mailData.sender ..
                                "', '" ..
                                    mailData.subject ..
                                        "', '" .. mailData.message .. "', '" .. GenerateMailId() .. "', '0')"
            )
        else
            ExecuteSql(
                false,
                "INSERT INTO `player_mails` (`identifier`, `sender`, `subject`, `message`, `mailid`, `read`, `button`) VALUES ('" ..
                    identifier ..
                        "', '" ..
                            mailData.sender ..
                                "', '" ..
                                    mailData.subject ..
                                        "', '" ..
                                            mailData.message ..
                                                "', '" ..
                                                    GenerateMailId() ..
                                                        "', '0', '" .. json.encode(mailData.button) .. "')"
            )
        end
        SetTimeout(
            200,
            function()
                ExecuteSql(
                    false,
                    'SELECT * FROM `player_mails` WHERE `identifier` = "' ..
                        Player.PlayerData.citizenid .. '" ORDER BY `date` DESC',
                    function(mails)
                        if mails[1] ~= nil then
                            for k, v in pairs(mails) do
                                if mails[k].button ~= nil then
                                    mails[k].button = json.decode(mails[k].button)
                                end
                            end
                        end

                        TriggerClientEvent("s4-phone:client:UpdateMails", src, mails)
                    end
                )
            end
        )
    end
)

RegisterServerEvent("s4-phone:server:ClearButtonData")
AddEventHandler(
    "s4-phone:server:ClearButtonData",
    function(mailId)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)

        ExecuteSql(
            false,
            'UPDATE `player_mails` SET `button` = "" WHERE `mailid` = "' ..
                mailId .. '" AND `identifier` = "' .. Player.PlayerData.citizenid .. '"'
        )
        SetTimeout(
            200,
            function()
                ExecuteSql(
                    false,
                    'SELECT * FROM `player_mails` WHERE `identifier` = "' ..
                        Player.PlayerData.citizenid .. '" ORDER BY `date` DESC',
                    function(mails)
                        if mails[1] ~= nil then
                            for k, v in pairs(mails) do
                                if mails[k].button ~= nil then
                                    mails[k].button = json.decode(mails[k].button)
                                end
                            end
                        end

                        TriggerClientEvent("s4-phone:client:UpdateMails", src, mails)
                    end
                )
            end
        )
    end
)

RegisterServerEvent("s4-phone:server:MentionedPlayer")
AddEventHandler(
    "s4-phone:server:MentionedPlayer",
    function(firstName, lastName, TweetMessage)
        for k, v in pairs(QBCore.Functions.GetPlayers()) do
            local Player = QBCore.Functions.GetPlayer(v)
            local firstname = Player.PlayerData.charinfo.firstname
            local lastname = Player.PlayerData.charinfo.lastname

            if Player ~= nil then
                if (character.firstname == firstName and character.lastname == lastName) then
                    MIPhone.SetPhoneAlerts(Player.PlayerData.citizenid, "twitter")

                    MIPhone.AddMentionedTweet(Player.PlayerData.citizenid, TweetMessage)
                    TriggerClientEvent(
                        "s4-phone:client:GetMentioned",
                        Player.source,
                        TweetMessage,
                        AppAlerts[Player.PlayerData.citizenid]["twitter"]
                    )
                else
                    local MentionedTarget = result[1].citizenid
                    MIPhone.SetPhoneAlerts(MentionedTarget, "twitter")
                    MIPhone.AddMentionedTweet(MentionedTarget, TweetMessage)
                end
            end
        end
    end
)

RegisterServerEvent("qb-phone:server:CallContact")
AddEventHandler(
    "qb-phone:server:CallContact",
    function(TargetData, CallId, AnonymousCall)
        local src = source
        local Ply = QBCore.Functions.GetPlayer(src)
        local Target = QBCore.Functions.GetPlayerByPhone(TargetData.number)

        if Target ~= nil then
            TriggerClientEvent(
                "s4-phone:client:GetCalled",
                Target.PlayerData.source,
                Ply.PlayerData.charinfo.phone,
                CallId,
                AnonymousCall
            )
        end
    end
)

-- ESX(V1_Final) Fix
QBCore.Functions.CreateCallback(
    "s4-phone:server:GetBankData",
    function(source, cb)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        local character = GetCharacter(src)
        cb(
            {
                bank = xPlayer.PlayerData.money["bank"],
                iban = xPlayer.PlayerData.charinfo.iban,
                username = xPlayer.PlayerData.charinfo.firstname .. " " .. xPlayer.PlayerData.charinfo.lastname
            }
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:envtelefonlar",
    function(source, cb)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)
        local inv = QBCore.Player.LoadInventory(true)
        cb(inv)
    end
)

-- ESX(V1_Final) Fix
QBCore.Functions.CreateCallback(
    "s4-phone:server:CanPayInvoice",
    function(source, cb, amount)
        local src = source
        local xPlayer = QBCore.Functions.GetPlayer(src)

        cb(xPlayer.PlayerData.money["bank"] >= amount)
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:buybm",
    function(source, cb, arg)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        if tonumber(arg) < xPlayer.PlayerData.money["bank"] then
            cb(true)
        else
            cb(false)
        end
    end
)

RegisterServerEvent("s4-phone:server:givebmitem")
AddEventHandler(
    "s4-phone:server:givebmitem",
    function(item)
        local xPlayer = QBCore.Functions.GetPlayer(source)
        local EsxItems = QBCore.Shared.Items()
        if item then
            TriggerClientEvent("inventory:client:ItemBox", source, EsxItems[item], "add", 1)
            xPlayer.Functions.AddItem(item, 1)
        end
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetInvoices",
    function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        local invos = {}

        ExecuteSql(
            false,
            "SELECT * FROM `billing` WHERE `identifier` = '" .. Player.PlayerData.citizenid .. "'",
            function(result)
                if result[1] ~= nil then
                    for k, v in pairs(result) do
                        local pnm = nil

                        local Ply = QBCore.Functions.GetPlayerByCitizenId(v.sender)
                        if Ply ~= nil then
                            pnm = Ply.PlayerData.charinfo.phone
                        else
                            ExecuteSql(
                                true,
                                "SELECT * FROM `players` WHERE `citizenid` = '" .. v.sender .. "'",
                                function(res)
                                    if res[1] ~= nil then
                                        pnm = res[1].phone
                                    else
                                        pnm = nil
                                    end
                                end
                            )
                        end

                        local idata = {}

                        idata = {
                            label = v.label,
                            amount = v.amount,
                            number = pnm,
                            id = v.id
                        }

                        table.insert(invos, idata)
                    end
                    cb(invos)
                else
                    cb(nil)
                end
            end
        )
        --[[   Player = QBCore.Functions.GetPlayer(source)
    ExecuteSql(false, "SELECT * FROM billing  WHERE `identifier` = '"..Player.PlayerData.citizenid.."'", function(invoices)
        if invoices[1] ~= nil then
		    
            for k, v in pairs(invoices) do
                local Ply = QBCore.Functions.GetPlayerByCitizenId(v.sender)
                if Ply ~= nil then
                    v.number = GetCharacter(Ply.source).phone
                else
                    ExecuteSql(true, "SELECT * FROM `users` WHERE `identifier` = '"..v.sender.."'", function(res)
                        if res[1] ~= nil then
                            v.number = res[1].phone
                        else
                            v.number = nil
                        end
                    end)
                end
            end
            PhoneData.Invoices = invoices
			print(invoices)
            cb(invoices)
        else
            cb({})
        end
    end)  ]]
    end
)

RegisterServerEvent("s4-phone:server:UpdateHashtags")
AddEventHandler(
    "s4-phone:server:UpdateHashtags",
    function(Handle, messageData)
        if Hashtags[Handle] ~= nil and next(Hashtags[Handle]) ~= nil then
            table.insert(Hashtags[Handle].messages, messageData)
        else
            Hashtags[Handle] = {
                hashtag = Handle,
                messages = {}
            }
            table.insert(Hashtags[Handle].messages, messageData)
        end
        TriggerClientEvent("s4-phone:client:UpdateHashtags", -1, Handle, messageData)
    end
)

MIPhone.AddMentionedTweet = function(identifier, TweetData)
    if MentionedTweets[identifier] == nil then
        MentionedTweets[identifier] = {}
    end
    table.insert(MentionedTweets[identifier], TweetData)
end

MIPhone.SetPhoneAlerts = function(identifier, app, alerts)
    if identifier ~= nil and app ~= nil then
        if AppAlerts[identifier] == nil then
            AppAlerts[identifier] = {}
            if AppAlerts[identifier][app] == nil then
                if alerts == nil then
                    AppAlerts[identifier][app] = 1
                else
                    AppAlerts[identifier][app] = alerts
                end
            end
        else
            if AppAlerts[identifier][app] == nil then
                if alerts == nil then
                    AppAlerts[identifier][app] = 1
                else
                    AppAlerts[identifier][app] = 0
                end
            else
                if alerts == nil then
                    AppAlerts[identifier][app] = AppAlerts[identifier][app] + 1
                else
                    AppAlerts[identifier][app] = AppAlerts[identifier][app] + 0
                end
            end
        end
    end
end

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetContactPictures",
    function(source, cb, Chats)
        for k, v in pairs(Chats) do
            local Player = QBCore.Functions.GetPlayerByCitizenId(v.number)

            ExecuteSql(
                false,
                "SELECT * FROM `players` WHERE `phone`='" .. v.number .. "'",
                function(result)
                    if result[1] ~= nil then
                        if result[1].profilepicture ~= nil then
                            v.picture = result[1].profilepicture
                        else
                            v.picture = "default"
                        end
                    end
                end
            )
        end
        SetTimeout(
            100,
            function()
                cb(Chats)
            end
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetContactPicture",
    function(source, cb, Chat)
        ExecuteSql(
            false,
            "SELECT * FROM `players` WHERE `phone`='" .. Chat.number .. "'",
            function(result)
                if result[1] and result[1].background then
                    Chat.picture = result[1].background
                    cb(Chat)
                else
                    Chat.picture = "default"
                    cb(Chat)
                end
            end
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetPicture",
    function(source, cb, number)
        local Player = GetPlayerFromPhone(number)
        local Picture = nil
        local number = Player.PlayerData.charinfo.phone

        ExecuteSql(
            false,
            "SELECT * FROM `players`",
            function(result)
                if result[1] ~= nil then
                    if result[1].profilepicture ~= nil then
                        Picture = result[1].profilepicture
                    else
                        Picture = "default"
                    end
                    cb(Picture)
                else
                    cb(nil)
                end
            end
        )
    end
)

RegisterServerEvent("s4-phone:server:SetPhoneAlerts")
AddEventHandler(
    "s4-phone:server:SetPhoneAlerts",
    function(app, alerts)
        local src = source
        local Identifier = QBCore.Functions.GetPlayer(src).citizenid
        MIPhone.SetPhoneAlerts(Identifier, app, alerts)
    end
)

RegisterServerEvent("s4-phone:server:UpdateTweets")
AddEventHandler(
    "s4-phone:server:UpdateTweets",
    function(TweetData, type)
        Tweets = NewTweets
        local TwtData = TweetData
        local src = source
        TriggerClientEvent("s4-phone:client:UpdateTweets", -1, src, TwtData, type)
    end
)

function Deger()

end

RegisterServerEvent("s4-phone:server:TransferMoney")
AddEventHandler(
    "s4-phone:server:TransferMoney",
    function(iban, amount)
        local src = source
        local sender = QBCore.Functions.GetPlayer(src)

        local query = "%" .. iban .. "%"
        local result =
            exports.ghmattimysql:executeSync("SELECT * FROM players WHERE charinfo LIKE @query", {["@query"] = query})
        if result[1] ~= nil then
            local reciever = QBCore.Functions.GetPlayerByCitizenId(result[1].citizenid)

            if reciever ~= nil then
                local PhoneItem = reciever.Functions.GetItemByName("phone")
                reciever.Functions.AddMoney("bank", amount, "phone-transfered-from-" .. sender.PlayerData.citizenid)
                sender.Functions.RemoveMoney("bank", amount, "phone-transfered-to-" .. reciever.PlayerData.citizenid)

                if PhoneItem ~= nil then
                    TriggerClientEvent(
                        "s4-phone:client:TransferMoney",
                        reciever.PlayerData.source,
                        amount,
                        reciever.PlayerData.money["bank"]
                    )
                end
                TriggerEvent("qb-log:server:CreateLog", "s4phonebank", "Para Transferi", "red", "Gönderen: **"..sender.PlayerData.charinfo.firstname..' '..sender.PlayerData.charinfo.lastname..'** \n Para Miktarı: **$'..amount..'** \n Gönderen License ID: **'..sender.PlayerData.license..'** \n Gönderen Citizen ID: **'..sender.PlayerData.citizenid..'**\n Gönderen Güncel Banka: **$'..sender.PlayerData.money["bank"]..'**\n Gönderen IBAN: **'..sender.PlayerData.metadata["iban"]..'**\n **--------**\n Gönderilen Kişi: **'..reciever.PlayerData.charinfo.firstname..' '..reciever.PlayerData.charinfo.firstname..'** \n Gönderilen Citizen ID: **'..reciever.PlayerData.citizenid..'** \n Gönderilen License ID: **'..reciever.PlayerData.license..'**\n Gönderilen IBAN: **'..reciever.PlayerData.metadata["iban"]..'**')
            else
                local moneyInfo = json.decode(result[1].money)
                moneyInfo.bank = round((moneyInfo.bank + amount))
                exports.ghmattimysql:execute(
                    "UPDATE players SET money=@money WHERE citizenid=@citizenid",
                    {["@money"] = json.encode(moneyInfo), ["@citizenid"] = result[1].citizenid}
                )
                sender.Functions.RemoveMoney("bank", amount, "phone-transfered")
            end
        else
            TriggerClientEvent("QBCore:Notify", src, "Geçersiz!", "error")
        end
    end
)

RegisterServerEvent("s4-phone:server:EditContact")
AddEventHandler(
    "s4-phone:server:EditContact",
    function(newName, newNumber, newIban, oldName, oldNumber, oldIban)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)
        ExecuteSql(
            false,
            "UPDATE `player_contacts` SET `name` = '" ..
                newName ..
                    "', `number` = '" ..
                        newNumber ..
                            "', `iban` = '" ..
                                newIban ..
                                    "' WHERE `identifier` = '" ..
                                        Player.PlayerData.citizenid ..
                                            "' AND `name` = '" .. oldName .. "' AND `number` = '" .. oldNumber .. "'"
        )
    end
)

RegisterServerEvent("s4-phone:server:RemoveContact")
AddEventHandler(
    "s4-phone:server:RemoveContact",
    function(Name, Number)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)

        ExecuteSql(
            false,
            "DELETE FROM `player_contacts` WHERE `name` = '" ..
                Name .. "' AND `number` = '" .. Number .. "' AND `identifier` = '" .. Player.PlayerData.citizenid .. "'"
        )
    end
)

RegisterServerEvent("s4-phone:server:AddNewContact")
AddEventHandler(
    "s4-phone:server:AddNewContact",
    function(name, number, iban)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)

        ExecuteSql(
            false,
            "INSERT INTO `player_contacts` (`identifier`, `name`, `number`, `iban`) VALUES ('" ..
                Player.PlayerData.citizenid ..
                    "', '" .. tostring(name) .. "', '" .. tostring(number) .. "', '" .. tostring(iban) .. "')"
        )
    end
)

RegisterServerEvent("s4-phone:server:UpdateMessages")
AddEventHandler(
    "s4-phone:server:UpdateMessages",
    function(ChatMessages, ChatNumber, New)
        local src = source
        local SenderData = QBCore.Functions.GetPlayer(src)

        ExecuteSql(
            false,
            "SELECT * FROM `players` WHERE `phone`='" .. ChatNumber .. "'",
            function(Player)
                if Player[1] ~= nil then
                    local TargetData = QBCore.Functions.GetPlayerByCitizenId(Player[1].citizenid)

                    if TargetData ~= nil then
                        ExecuteSql(
                            false,
                            "SELECT * FROM `phone_messages` WHERE `identifier` = '" ..
                                SenderData.PlayerData.citizenid .. "' AND `number` = '" .. ChatNumber .. "'",
                            function(Chat)
                                if Chat[1] ~= nil then
                                    -- Update for target
                                    ExecuteSql(
                                        false,
                                        "UPDATE `phone_messages` SET `messages` = '" ..
                                            json.encode(ChatMessages) ..
                                                "' WHERE `identifier` = '" ..
                                                    TargetData.PlayerData.citizenid ..
                                                        "' AND `number` = '" ..
                                                            SenderData.PlayerData.charinfo.phone .. "'"
                                    )

                                    -- Update for sender
                                    ExecuteSql(
                                        false,
                                        "UPDATE `phone_messages` SET `messages` = '" ..
                                            json.encode(ChatMessages) ..
                                                "' WHERE `identifier` = '" ..
                                                    SenderData.PlayerData.citizenid ..
                                                        "' AND `number` = '" ..
                                                            SenderData.PlayerData.charinfo.phone .. "'"
                                    )

                                    -- Send notification & Update messages for target
                                    TriggerClientEvent(
                                        "s4-phone:client:UpdateMessages",
                                        TargetData.source,
                                        ChatMessages,
                                        SenderData.PlayerData.charinfo.phone,
                                        false
                                    )
                                else
                                    -- Insert for target
                                    ExecuteSql(
                                        false,
                                        "INSERT INTO `phone_messages` (`identifier`, `number`, `messages`) VALUES ('" ..
                                            TargetData.citizenid ..
                                                "', '" ..
                                                    SenderData.PlayerData.charinfo.phone ..
                                                        "', '" .. json.encode(ChatMessages) .. "')"
                                    )

                                    -- Insert for sender
                                    ExecuteSql(
                                        false,
                                        "INSERT INTO `phone_messages` (`identifier`, `number`, `messages`) VALUES ('" ..
                                            SenderData.citizenid ..
                                                "', '" ..
                                                    SenderData.PlayerData.charinfo.phone ..
                                                        "', '" .. json.encode(ChatMessages) .. "')"
                                    )
                                    TriggerEvent("qb-log:server:CreateLog", "s4phonemesaj", SenderData.charinfo.firstname..' '..SenderData.charinfo.lastname..' Mesaj Gönderdi', "black", "Mesajı Gönderilen Kişi: **"..TargetData.charinfo.firstname..' '..TargetData.charinfo.lastname..'**\n Mesaj İçeriği: **'..json.encode(ChatMessages)..'**\n Mesajı Gönderen Cid: '..SenderData.citizenid..'**\n Gönderilen Kişi Cid: '..TargetData.citizenid)

                                    -- Send notification & Update messages for target
                                    TriggerClientEvent(
                                        "s4-phone:client:UpdateMessages",
                                        TargetData.source,
                                        ChatMessages,
                                        SenderData.PlayerData.charinfo.phone,
                                        true
                                    )
                                end
                            end
                        )
                    else
                        ExecuteSql(
                            false,
                            "SELECT * FROM `phone_messages` WHERE `identifier` = '" ..
                                SenderData.PlayerData.citizenid .. "' AND `number` = '" .. ChatNumber .. "'",
                            function(Chat)
                                if Chat[1] ~= nil then
                                    -- Update for target
                                    ExecuteSql(
                                        false,
                                        "UPDATE `phone_messages` SET `messages` = '" ..
                                            json.encode(ChatMessages) ..
                                                "' WHERE `identifier` = '" ..
                                                    Player[1].identifier ..
                                                        "' AND `number` = '" ..
                                                            SenderData.PlayerData.charinfo.phone .. "'"
                                    )

                                    -- Update for sender
                                    ExecuteSql(
                                        false,
                                        "UPDATE `phone_messages` SET `messages` = '" ..
                                            json.encode(ChatMessages) ..
                                                "' WHERE `identifier` = '" ..
                                                    SenderData.PlayerData.citizenid ..
                                                        "' AND `number` = '" .. Player[1].phone .. "'"
                                    )
                                else
                                    -- Insert for target
                                    ExecuteSql(
                                        false,
                                        "INSERT INTO `phone_messages` (`identifier`, `number`, `messages`) VALUES ('" ..
                                            Player[1].identifier ..
                                                "', '" ..
                                                    SenderData.PlayerData.charinfo.phone ..
                                                        "', '" .. json.encode(ChatMessages) .. "')"
                                    )

                                    -- Insert for sender
                                    ExecuteSql(
                                        false,
                                        "INSERT INTO `phone_messages` (`identifier`, `number`, `messages`) VALUES ('" ..
                                            SenderData.PlayerData.citizenid ..
                                                "', '" .. Player[1].phone .. "', '" .. json.encode(ChatMessages) .. "')"
                                    )
                                end
                            end
                        )
                    end
                end
            end
        )
    end
)

RegisterServerEvent("s4-phone:server:AddRecentCall")
AddEventHandler("s4-phone:server:AddRecentCall",
    function(type, data)
        local src = source
        local Ply = QBCore.Functions.GetPlayer(src)

        local Hour = os.date("%H")
        local Minute = os.date("%M")
        local label = Hour .. ":" .. Minute

        TriggerClientEvent("s4-phone:client:AddRecentCall", src, data, label, type)

        local Trgt = GetPlayerFromPhone(data.number)
        if Trgt ~= nil then
            TriggerClientEvent(
                "s4-phone:client:AddRecentCall",
                Trgt.source,
                {
                    name = Ply.PlayerData.charinfo.firstname .. " " .. Ply.PlayerData.charinfo.lastname,
                    number = Ply.PlayerData.charinfo.phone,
                    anonymous = anonymous
                },
                label,
                "outgoing"
            )
        end
    end)

RegisterServerEvent("s4-phone:server:CancelCall")
AddEventHandler(
    "s4-phone:server:CancelCall",
    function(ContactData)
        local Ply = GetPlayerFromPhone(ContactData.TargetData.number)

        if Ply ~= nil then
            TriggerClientEvent("s4-phone:client:CancelCall", Ply.source)
        end
    end
)

RegisterServerEvent("s4-phone:server:AnswerCall")
AddEventHandler(
    "s4-phone:server:AnswerCall",
    function(CallData)
        local Ply = GetPlayerFromPhone(CallData.TargetData.number)

        if Ply ~= nil then
            TriggerClientEvent("s4-phone:client:AnswerCall", Ply.source)
        end
    end
)

RegisterServerEvent("s4:AnswerCall")
AddEventHandler(
    "s4:AnswerCall",
    function(Ply, tply)
        local TPlayer = GetPlayerFromPhone(tply.TargetData.number)

        if Ply ~= nil then
            if TPlayer ~= nil then
                exports["saltychat"]:EstablishCall(TPlayer.source, Ply)
                exports["saltychat"]:EstablishCall(Ply, TPlayer.source)
            end
        end
    end
)

RegisterServerEvent("s4:CancelCall")
AddEventHandler(
    "s4:CancelCall",
    function(Ply, tply)
        local TPlayer = GetPlayerFromPhone(tply.TargetData.number)

        if Ply ~= nil then
            if TPlayer ~= nil then
                exports["saltychat"]:EndCall(TPlayer.source, Ply)
                exports["saltychat"]:EndCall(Ply, TPlayer.source)
            end
        end
    end
)

RegisterServerEvent("s4-phone:server:SaveMetaData")
AddEventHandler(
    "s4-phone:server:SaveMetaData",
    function(column, data)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)

        if data and column then
            if type(data) == "table" then
                ExecuteSql(
                    false,
                    "UPDATE `players` SET `" ..
                        column ..
                            "` = '" ..
                                json.encode(data) .. "' WHERE `citizenid` = '" .. Player.PlayerData.citizenid .. "'"
                )
            else
                ExecuteSql(
                    false,
                    "UPDATE `players` SET `" ..
                        column .. "` = '" .. data .. "' WHERE `citizenid` = '" .. Player.PlayerData.citizenid .. "'"
                )
            end
        end
    end
)

function escape_sqli(source)
    local replacements = {['"'] = '\\"', ["'"] = "\\'"}
    return source:gsub('[\'"]', replacements) -- or string.gsub( source, "['\"]", replacements )
end

QBCore.Functions.CreateCallback(
    "s4-phone:server:FetchResult",
    function(source, cb, search)
        local src = source
        local search = escape_sqli(search)
        local searchData = {}
        local Player = QBCore.Functions.GetPlayer(src)
        local ApaData = {}
        local character = GetCharacter(src)
        ExecuteSql(
            false,
            "SELECT * FROM `players` WHERE firstname LIKE '%" .. search .. "%'",
            function(result)
                if result[1] ~= nil then
                    for k, v in pairs(result) do
                        local driverlicense = false
                        local weaponlicense = false
                        local doingSomething = true

                        if Config.UseESXLicense then
                            CheckLicense(
                                v.PlayerData.citizenid,
                                "weapon",
                                function(has)
                                    if has then
                                        weaponlicense = true
                                    end

                                    CheckLicense(
                                        v.identifier,
                                        "drive",
                                        function(has)
                                            if has then
                                                driverlicense = true
                                            end

                                            doingSomething = false
                                        end
                                    )
                                end
                            )
                        else
                            doingSomething = false
                        end

                        while doingSomething do
                            Wait(1)
                        end

                        table.insert(
                            searchData,
                            {
                                identifier = Player.PlayerData.citizenid,
                                firstname = Player.PlayerData.charinfo.firstname,
                                lastname = Player.PlayerData.charinfo.lastname,
                                birthdate = Player.PlayerData.charinfo.birthday,
                                phone = Player.PlayerData.charinfo.phone,
                                gender = Player.PlayerData.charinfo.gender,
                                weaponlicense = weaponlicense,
                                driverlicense = driverlicense
                            }
                        )
                    end
                    cb(searchData)
                else
                    cb(nil)
                end
            end
        )
    end
)

function CheckLicense(target, type, cb)
    local target = target

    if target then
        exports.ghmattimysql:execute(
            "SELECT COUNT(*) as count FROM user_licenses WHERE type = @type AND owner = @owner",
            {
                ["@type"] = type,
                ["@owner"] = target
            },
            function(result)
                if tonumber(result[1].count) > 0 then
                    cb(true)
                else
                    cb(false)
                end
            end
        )
    else
        cb(false)
    end
end

QBCore.Functions.CreateCallback('qb-phone_new:server:GetVehicleSearchResults', function(source, cb, search)
    local src = source
    local search = escape_sqli(search)
    local searchData = {}
    exports.ghmattimysql:execute('SELECT * FROM `player_vehicles` WHERE `plate` LIKE "%'..search..'%" OR `citizenid` = "'..search..'"', function(result)
        if result[1] ~= nil then
            for k, v in pairs(result) do
                exports.ghmattimysql:execute('SELECT * FROM `players` WHERE `citizenid` = "'..result[k].citizenid..'"', function(player)
                    if player[1] ~= nil then 
                        local charinfo = json.decode(player[1].charinfo)
                        local vehicleInfo = QBCore.Shared.Vehicles[result[k].vehicle]
                        if vehicleInfo ~= nil then 
                            table.insert(searchData, {
                                plate = result[k].plate,
                                status = true,
                                owner = charinfo.firstname .. " " .. charinfo.lastname,
                                citizenid = result[k].citizenid,
                                label = vehicleInfo["name"]
                            })
                        else
                            table.insert(searchData, {
                                plate = result[k].plate,
                                status = true,
                                owner = charinfo.firstname .. " " .. charinfo.lastname,
                                citizenid = result[k].citizenid,
                                label = "Name not found.."
                            })
                        end
                    end
                end)
            end
        else
            if GeneratedPlates[search] ~= nil then
                table.insert(searchData, {
                    plate = GeneratedPlates[search].plate,
                    status = GeneratedPlates[search].status,
                    owner = GeneratedPlates[search].owner,
                    citizenid = GeneratedPlates[search].citizenid,
                    label = "Brand unknown.."
                })
            else
                local ownerInfo = GenerateOwnerName()
                GeneratedPlates[search] = {
                    plate = search,
                    status = true,
                    owner = ownerInfo.name,
                    citizenid = ownerInfo.citizenid,
                }
                table.insert(searchData, {
                    plate = search,
                    status = true,
                    owner = ownerInfo.name,
                    citizenid = ownerInfo.citizenid,
                    label = "Brand unknown.."
                })
            end
        end
        cb(searchData)
    end)
end)

QBCore.Functions.CreateCallback(
    "s4-phone:server:ScanPlate",
    function(source, cb, plate)
        local src = source
        local vehicleData = {}
        local character = GetCharacter(src)
        if plate ~= nil then
            ExecuteSql(
                false,
                'SELECT * FROM `owned_vehicles` WHERE `plate` = "' .. plate .. '"',
                function(result)
                    if result[1] ~= nil then
                        ExecuteSql(
                            true,
                            'SELECT * FROM `players` WHERE `citizenid` = "' .. result[1].PlayerData.citizenid .. '"',
                            function(player)
                                vehicleData = {
                                    plate = plate,
                                    status = true,
                                    owner = character.firstname .. " " .. character.lastname,
                                    identifier = result[1].identifier
                                }
                            end
                        )
                    elseif GeneratedPlates ~= nil and GeneratedPlates[plate] ~= nil then
                        vehicleData = GeneratedPlates[plate]
                    else
                        local ownerInfo = GenerateOwnerName()
                        GeneratedPlates[plate] = {
                            plate = plate,
                            status = true,
                            owner = ownerInfo.name,
                            identifier = ownerInfo.PlayerData.citizenid
                        }
                        vehicleData = {
                            plate = plate,
                            status = true,
                            owner = ownerInfo.name,
                            identifier = ownerInfo.PlayerData.citizenid
                        }
                    end
                    cb(vehicleData)
                end
            )
        else
            TriggerClientEvent("notification", src, Lang("NO_VEHICLE"), 2)
            cb(nil)
        end
    end
)

function GenerateOwnerName()
    local names = {
        [1] = {name = "Jan Bloksteen", identifier = "DSH091G93"},
        [2] = {name = "Jay Dendam", identifier = "AVH09M193"},
        [3] = {name = "Ben Klaariskees", identifier = "DVH091T93"},
        [4] = {name = "Karel Bakker", identifier = "GZP091G93"},
        [5] = {name = "Klaas Adriaan", identifier = "DRH09Z193"},
        [6] = {name = "Nico Wolters", identifier = "KGV091J93"},
        [7] = {name = "Mark Hendrickx", identifier = "ODF09S193"},
        [8] = {name = "Bert Johannes", identifier = "KSD0919H3"},
        [9] = {name = "Karel de Grote", identifier = "NDX091D93"},
        [10] = {name = "Jan Pieter", identifier = "ZAL0919X3"},
        [11] = {name = "Huig Roelink", identifier = "ZAK09D193"},
        [12] = {name = "Corneel Boerselman", identifier = "POL09F193"},
        [13] = {name = "Hermen Klein Overmeen", identifier = "TEW0J9193"},
        [14] = {name = "Bart Rielink", identifier = "YOO09H193"},
        [15] = {name = "Antoon Henselijn", identifier = "QBC091H93"},
        [16] = {name = "Aad Keizer", identifier = "YDN091H93"},
        [17] = {name = "Thijn Kiel", identifier = "PJD09D193"},
        [18] = {name = "Henkie Krikhaar", identifier = "RND091D93"},
        [19] = {name = "Teun Blaauwkamp", identifier = "QWE091A93"},
        [20] = {name = "Dries Stielstra", identifier = "KJH0919M3"},
        [21] = {name = "Karlijn Hensbergen", identifier = "ZXC09D193"},
        [22] = {name = "Aafke van Daalen", identifier = "XYZ0919C3"},
        [23] = {name = "Door Leeferds", identifier = "ZYX0919F3"},
        [24] = {name = "Nelleke Broedersen", identifier = "IOP091O93"},
        [25] = {name = "Renske de Raaf", identifier = "PIO091R93"},
        [26] = {name = "Krisje Moltman", identifier = "LEK091X93"},
        [27] = {name = "Mirre Steevens", identifier = "ALG091Y93"},
        [28] = {name = "Joosje Kalvenhaar", identifier = "YUR09E193"},
        [29] = {name = "Mirte Ellenbroek", identifier = "SOM091W93"},
        [30] = {name = "Marlieke Meilink", identifier = "KAS09193"}
    }
    return names[math.random(1, #names)]
end

QBCore.Functions.CreateUseableItem(
    "phone",
    function(source, item)
        local Player = QBCore.Functions.GetPlayer(source)
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetGarageVehicles",
    function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        local Vehicles = {}

        local result =
            exports.ghmattimysql:executeSync(
            "SELECT * FROM player_vehicles WHERE citizenid=@citizenid",
            {["@citizenid"] = Player.PlayerData.citizenid}
        )
        if result[1] ~= nil then
            for k, v in pairs(result) do
                local VehicleData = QBCore.Shared.Vehicles[v.vehicle]

                local VehicleGarage = "None"
                if v.garage ~= nil then
                    if Garages[v.garage] ~= nil then
                        VehicleGarage = Garages[v.garage]["label"]
                    end
                end

                local VehicleState = "In"
                if v.state == 0 then
                    VehicleState = "Out"
                elseif v.state == 2 then
                    VehicleState = "Impounded"
                end

                local vehdata = {}

                if VehicleData["brand"] ~= nil then
                    vehdata = {
                        fullname = VehicleData["brand"] .. " " .. VehicleData["name"],
                        brand = VehicleData["brand"],
                        model = VehicleData["name"],
                        plate = v.plate,
                        garage = VehicleGarage,
                        state = VehicleState,
                        fuel = v.fuel,
                        engine = v.engine,
                        body = v.body
                    }
                else
                    vehdata = {
                        fullname = VehicleData["name"],
                        brand = VehicleData["name"],
                        model = VehicleData["name"],
                        plate = v.plate,
                        garage = VehicleGarage,
                        state = VehicleState,
                        fuel = v.fuel,
                        engine = v.engine,
                        body = v.body
                    }
                end

                table.insert(Vehicles, vehdata)
            end
            cb(Vehicles)
        else
            cb(nil)
        end
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetGaleri",
    function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        local Resimler = {}

        ExecuteSql(
            false,
            "SELECT * FROM `s4_gallery` WHERE `identifier` = '" .. Player.PlayerData.citizenid .. "'",
            function(result)
                if result[1] ~= nil then
                    for k, v in pairs(result) do
                        local resdata = {}

                        resdata = {
                            resim = v.resim,
                            id = v.id
                        }

                        table.insert(Resimler, resdata)
                    end
                    cb(Resimler)
                else
                    cb(nil)
                end
            end
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:InstagramHesaplari",
    function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        local Users = {}
        ExecuteSql(
            false,
            "SELECT * from players",
            function(result)
                if result[1] ~= nil then
                    for k, v in pairs(result) do
                        local usdata = {}

                        usdata = {
                            username = Player.PlayerData.charinfo.firstname ..
                                " " .. Player.PlayerData.charinfo.lastname,
                            identifier = Player.PlayerData.citizenid
                        }

                        local userdata =
                            exports.ghmattimysql:executeSync(
                            "SELECT * FROM `s4_instagram_takip` WHERE `takip_eden` = '" ..
                                Player.PlayerData.citizenid .. "' AND `takip_edilen` = '" .. v.citizenid .. "'  ",
                            {}
                        )

                        if userdata and userdata[1] then
                            usdata.takip = 1
                        end

                        table.insert(Users, usdata)
                    end
                    cb(Users)
                else
                    cb(nil)
                end
            end
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetirInstaZamanTuneli",
    function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        local Resimler = {}

        ExecuteSql(
            false,
            "SELECT * FROM `s4_instagram_postlar` ORDER BY id DESC LIMIT 10 ",
            function(result)
                if result[1] ~= nil then
                    for k, v in pairs(result) do
                        local resdata = {}

                        resdata = {
                            resim = v.foto,
                            id = v.id,
                            efekt = v.efekt,
                            yazi = v.yazi,
                            owner = v.owner
                        }

                        local userdata =
                            exports.ghmattimysql:executeSync(
                            "SELECT * FROM players WHERE citizenid='" .. v.owner .. "' ",
                            {}
                        )

                        if userdata and userdata[1] then
                            resdata.username =
                                Player.PlayerData.charinfo.firstname .. " " .. Player.PlayerData.charinfo.lastname
                            resdata.profilepicture = userdata[1].profilepicture
                        end

                        table.insert(Resimler, resdata)
                    end
                    cb(Resimler)
                else
                    cb(nil)
                end
            end
        )
    end
)

function getTakipEdiyorMu(takip_eden, takip_edilen, cb) -- S4
    ExecuteSql(
        false,
        "SELECT * FROM `s4_instagram_takip` WHERE `takip_eden` = '" ..
            takip_eden .. "' AND `takip_edilen` = '" .. takip_edilen .. "'  ",
        function(result)
            if result[1] ~= nil then
                cb("takip")
            else
                cb(nil)
            end
        end
    )
end

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetGalerinsta",
    function(source, cb, arg)
        local Player = QBCore.Functions.GetPlayer(source)
        local identifier

        if arg then
            identifier = arg
        else
            identifier = Player.PlayerData.citizenid
        end

        local Resimler = {}

        ExecuteSql(
            false,
            "SELECT * FROM `s4_instagram_postlar` WHERE `owner` = '" .. identifier .. "'",
            function(result)
                if result[1] ~= nil then
                    for k, v in pairs(result) do
                        local resdata = {}

                        resdata = {
                            resim = v.foto,
                            id = v.id,
                            owner = v.owner,
                            efekt = v.efekt,
                            yazi = v.yazi
                        }

                        table.insert(Resimler, resdata)
                    end
                    cb(Resimler)
                else
                    cb(nil)
                end
            end
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetirinstaProfilBilgi",
    function(source, cb, arg)
        local Player = QBCore.Functions.GetPlayer(source)
        local identifier
        if arg then
            identifier = arg
        else
            identifier = Player.PlayerData.citizenid
        end

        local Bilgi = {}

        ExecuteSql(
            false,
            "SELECT * FROM `players` WHERE `citizenid` = '" .. identifier .. "'",
            function(result)
                if result[1] ~= nil then
                    Bilgi.username = Player.PlayerData.charinfo.firstname .. " " .. Player.PlayerData.charinfo.lastname
                    Bilgi.biyografi = result[1].biyografi
                    Bilgi.profilepicture = result[1].profilepicture
                    cb(Bilgi)
                else
                    cb(nil)
                end
            end
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetNotlar",
    function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        local Notlar = {}

        ExecuteSql(
            false,
            "SELECT * FROM `s4_not` WHERE `identifier` = '" .. Player.PlayerData.citizenid .. "'",
            function(result)
                if result[1] ~= nil then
                    for k, v in pairs(result) do
                        local resdata = {}

                        resdata = {
                            baslik = v.baslik,
                            aciklama = v.aciklama,
                            id = v.id
                        }

                        table.insert(Notlar, resdata)
                    end
                    cb(Notlar)
                else
                    cb(nil)
                end
            end
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:LoadAdverts",
    function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)
        local Adverts = {}

        ExecuteSql(
            false,
            "SELECT * FROM `s4_yellowpages`  ORDER BY `id` DESC LIMIT 30",
            function(result)
                if result[1] ~= nil then
                    for k, v in pairs(result) do
                        local resdata = {}

                        resdata = {
                            mesaj = v.mesaj,
                            isim = v.isim,
                            telno = v.telno
                        }

                        if v.resim then
                            resdata.resim = v.resim
                        end

                        table.insert(Adverts, resdata)
                    end
                    cb(Adverts)
                else
                    cb(nil)
                end
            end
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetCharacterData",
    function(source, cb, id)
        local src = source or id
        local xPlayer = QBCore.Functions.GetPlayer(source)

        cb(GetCharacter(src))
    end
)

-- Inventory Fix
QBCore.Functions.CreateCallback(
    "s4-phone:server:HasPhone",
    function(source, cb)
        local Player = QBCore.Functions.GetPlayer(source)

        if Player ~= nil then
            local HasPhone = Player.Functions.GetItemByName("phone")
            local retval = false

            if HasPhone ~= nil then
                cb(true)
            else
                cb(false)
            end
        end
    end
)

RegisterServerEvent("s4-phone:server:GiveContactDetails")
AddEventHandler(
    "s4-phone:server:GiveContactDetails",
    function(PlayerId)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)
        local character = GetCharacter(src)

        local SuggestionData = {
            name = {
                [1] = character.firstname,
                [2] = character.lastname
            },
            number = character.phone,
            bank = Player.PlayerData.money["bank"]
        }

        TriggerClientEvent("s4-phone:client:AddNewSuggestion", PlayerId, SuggestionData)
    end
)

RegisterServerEvent("s4-phone:server:AddTransaction")
AddEventHandler(
    "s4-phone:server:AddTransaction",
    function(data)
        local src = source
        local Player = QBCore.Functions.GetPlayer(src)

        ExecuteSql(
            false,
            "INSERT INTO `crypto_transactions` (`identifier`, `title`, `message`) VALUES ('" ..
                Player.PlayerData.citizenid ..
                    "', '" ..
                        escape_sqli(data.TransactionTitle) .. "', '" .. escape_sqli(data.TransactionMessage) .. "')"
        )
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetCurrentpolices",
    function(source, cb)
        local Lawyers = {}
        for k, v in pairs(QBCore.Functions.GetPlayers()) do
            local Player = QBCore.Functions.GetPlayer(v)
            local character = GetCharacter(v)

            if Player ~= nil then
                if Player.job.name == Config.Meslekler.polis then
                    table.insert(
                        Lawyers,
                        {
                            firstname = character.firstname,
                            lastname = character.lastname,
                            phone = character.phone
                        }
                    )
                end
            end
        end

        cb(Lawyers)
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetS4Share",
    function(source, cb)
        local Users = {}
        for k, v in pairs(QBCore.Functions.GetPlayers()) do
            local result =
                exports.ghmattimysql:executeSync(
                "SELECT bt FROM players WHERE citizenid = @idf",
                {["@idf"] = GetPlayerIdentifiers(v)[2]}
            )

            if result[1].bt == true then
                local data = {}

                data = {
                    user = Player.PlayerData.charinfo.firstname .. " " .. Player.PlayerData.charinfo.lastname,
                    identifier = GetPlayerIdentifiers(v)[1],
                    id = v
                }

                table.insert(Users, data)
            end
        end
        cb(Users)
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetCurrentMecano",
    function(source, cb)
        local Lawyers = {}
        for k, v in pairs(QBCore.Functions.GetPlayers()) do
            local Player = QBCore.Functions.GetPlayer(v)
            local character = GetCharacter(v)

            if Player ~= nil then
                if Player.job.name == Config.Meslekler.mekanik then
                    table.insert(
                        Lawyers,
                        {
                            firstname = Player.PlayerData.charinfo.firstname,
                            lastname = Player.PlayerData.charinfo.lastname,
                            phone = Player.PlayerData.charinfo.phone
                        }
                    )
                end
            end
        end

        cb(Lawyers)
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetCurrentDoctor",
    function(source, cb)
        local Lawyers = {}
        for k, v in pairs(QBCore.Functions.GetPlayers()) do
            local Player = QBCore.Functions.GetPlayer(v)
            local character = GetCharacter(v)

            if Player ~= nil then
                if Player.job.name == Config.Meslekler.doktor then
                    table.insert(
                        Lawyers,
                        {
                            firstname = Player.PlayerData.charinfo.firstname,
                            lastname = Player.PlayerData.charinfo.lastname,
                            phone = Player.PlayerData.charinfo.phone
                        }
                    )
                end
            end
        end

        cb(Lawyers)
    end
)

QBCore.Functions.CreateCallback(
    "s4-phone:server:GetCurrentLawyers",
    function(source, cb)
        local Lawyers = {}
        for k, v in pairs(QBCore.Functions.GetPlayers()) do
            local Player = QBCore.Functions.GetPlayer(v)
            local character = GetCharacter(v)

            if Player ~= nil then
                if Player.job.name == Config.Meslekler.avukat then
                    table.insert(
                        Lawyers,
                        {
                            firstname = Player.PlayerData.charinfo.firstname,
                            lastname = Player.PlayerData.charinfo.lastname,
                            phone = Player.PlayerData.charinfo.phone
                        }
                    )
                end
            end
        end

        cb(Lawyers)
    end
)

-- ESX(V1_Final) Fix
function GetCharacter(source)
    local xPlayer = QBCore.Functions.GetPlayer(source)

    local result =
        exports.ghmattimysql:executeSync(
        "SELECT * FROM players WHERE citizenid = @identifier",
        {
            ["@identifier"] = xPlayer.PlayerData.citizenid
        }
    )

    return result[1]
end

function GetPlayerFromPhone(phone)
    local result =
        exports.ghmattimysql:executeSync(
        "SELECT * FROM players WHERE phone = @phone",
        {
            ["@phone"] = phone
        }
    )

    if result[1] and result[1].identifier then
        return QBCore.Functions.GetPlayerByCitizenId(result[1].citizenid)
    end

    return nil
end

function ExecuteSql(wait, query, cb)
    local rtndata = {}
    local waiting = true
    exports.ghmattimysql:execute(
        query,
        {},
        function(data)
            if cb ~= nil and wait == false then
                cb(data)
            end
            rtndata = data
            waiting = false
        end
    )
    if wait then
        while waiting do
            Citizen.Wait(5)
        end
        if cb ~= nil and wait == true then
            cb(rtndata)
        end
    end

    return rtndata
end

function Lang(item)
    local lang = Config.Languages[Config.Language]

    if lang and lang[item] then
        return lang[item]
    end

    return item
end
