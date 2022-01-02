QBCore = nil

FENER = false
local old_tel
local old_parmak
local old_durum
local lastBM
local lastBM2
local SonGonderilen = {}

Citizen.CreateThread(function() 
    while true do
        Citizen.Wait(1)
        if QBCore == nil then
            TriggerEvent('QBCore:GetObject', function(obj) QBCore = obj end) 
            Citizen.Wait(200)
        end
    end
    while QBCore.Functions.GetPlayerData().job == nil do
        Citizen.Wait(10)
    end
    PlayerData = QBCore.Functions.GetPlayerData()
    Wait(200)
    LoadPhone()
	TriggerServerEvent('s4-phone:server:s4share', false)
end)

Wifi = false
WifiOpen = function() 

Wifi = not Wifi
Citizen.CreateThread(function()

	while Wifi do 
	  local uyku = 2000
	  if Config.BlackMarkets then 
	  local px, py, pz = table.unpack(GetEntityCoords(PlayerPedId()))
          
                for i = 1, #Config.BlackMarkets, 1 do
                    local dx, dy, dz = table.unpack(Config.BlackMarkets[i].coords)
 

                    if GetDistanceBetweenCoords(dx, dy, dz, px, py, pz, true) <= Config.BlackMarket_closeness then
						 if not lastBM then 
						   SendNUIMessage({ action = "bm" , state = 1 })
						 end
						 lastBM = i
						 uyku = 5
				    else 

					   if not lastBM then 
					     SendNUIMessage({ action = "bm" , state = 0 })
					   end
					   Wait(1000)
					   lastBM = nil
					   Wifi = true
	                   WifiOpen()
                    end
                     
                end
             
 
		 end
	  Citizen.Wait(uyku)	
	end
end)

end 
 


Citizen.CreateThread(function()

	while true do 
	  local uyku = 2000
	  if Config.BlackMarkets then 
	  local px, py, pz = table.unpack(GetEntityCoords(PlayerPedId()))
          
                for i = 1, #Config.BlackMarkets, 1 do
                    local dx, dy, dz = table.unpack(Config.BlackMarkets[i].coords)
 

                    if GetDistanceBetweenCoords(dx, dy, dz, px, py, pz, true) <= Config.BlackMarket_closeness then
						 lastBM2 = i
			             uyku = 5
				    else 
					   if not lastBM2 then 
					     SendNUIMessage({ action = "bm" , state = 0 })
					   end
					   Wait(1000)
					   lastBM2 = nil
                    end
            
                end
             
 
		 end
	  Citizen.Wait(uyku)	
	end
end)
-- Code
local PlayerJob = {}

phoneProp = 0
local phoneModel = `prop_npc_phone_02`

PhoneData = {
    MetaData = {},
    isOpen = false,
    PlayerData = nil,
    Contacts = {},
    Tweets = {},
    currentTab = nil,
    MentionedTweets = {},
    Hashtags = {},
    Chats = {},
    Invoices = {},
    CallData = {},
    RecentCalls = {},
    Garage = {},
    SelfTweets = {},
    Mails = {},
    Adverts = {},
    id = 1,
    GarageVehicles = {},
    AnimationData = {
        lib = nil,
        anim = nil,
    },
    SuggestedContacts = {},
    CryptoTransactions = {},
    Sounds = true
}

RegisterNetEvent('s4-phone:client:RaceNotify')
AddEventHandler('s4-phone:client:RaceNotify', function(message)
    if PhoneData.isOpen then
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang['RACE_TITLE'],
                text = message,
                icon = "fas fa-flag-checkered",
                color = "#353b48",
                timeout = 1500,
            },
        })
    else
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang['RACE_TITLE'],
                content = message,
                icon = "fas fa-flag-checkered",
                timeout = 3500,
                color = "#353b48",
            },
        })
    end
end)

 
local coords = {x = 1694.163, y = 3293.051, z = 40.14209, h = 88.75 }
local konum = vector3(coords.x, coords.y, coords.z)
Citizen.CreateThread(function()
    RequestModel(0x106D9A99)
    while not HasModelLoaded(0x106D9A99) do
        Wait(1)
    end
    npc = CreatePed(1, 0x106D9A99, coords.x, coords.y, coords.z, coords.h, false, true)
    SetPedCombatAttributes(npc, 46, true)               
    SetPedFleeAttributes(npc, 0, 0)               
    SetBlockingOfNonTemporaryEvents(npc, true)
    SetEntityAsMissionEntity(npc, true, true)
    SetEntityInvincible(npc, true)
    FreezeEntityPosition(npc, true)
	
	if not Config.ek_script_kullanim then 
	   while true do
	     sleepthread = 2000
	     local pPed = PlayerPedId()
	     local pCoords = GetEntityCoords(pPed)
		 local distance = #(pCoords - konum)
		 if distance <= 5.0 then
					sleepthread = 1
					if distance <= 1.5 then
				 
						DrawText3D(konum.x , konum.y  , konum.z + 0.9, '[E] - Telefon hackle')

						if IsControlJustPressed(1, 38) then
                          TriggerEvent('s4-phone:client:ctxmenu')
						  Wait(1000)
						end
					end
				end
		 
		 Citizen.Wait(sleepthread)
	   end
	end
end)


  
local coords2 = {x = 149.5101, y = -232.860, z = 54.424, h = 88.75 }
local konum2 = vector3(coords2.x, coords2.y, coords2.z)
Citizen.CreateThread(function()
   while true do
     sleepthread = 2000
	     local pPed = PlayerPedId()
	     local pCoords = GetEntityCoords(pPed)
		 local distance = #(pCoords - konum2)
		 if distance <= 5.0 then
					sleepthread = 1
					if distance <= 1.5 then
				 
						DrawText3D(konum2.x , konum2.y  , konum2.z + 0.9, '[E] - Telefon Satın al')

						if IsControlJustPressed(1, 38) then
                          TriggerServerEvent('s4-phone:telver')
						  Wait(1000)
						end
					end
				end
		Citizen.Wait(sleepthread)
   end
end)

function DrawText3D(x, y, z, text)
	SetTextScale(0.30, 0.30)
    SetTextFont(0)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry("STRING")
    SetTextCentre(true)
    AddTextComponentString(text)
    SetDrawOrigin(x,y,z, 0)
    DrawText(0.0, 0.0)
    local factor = (string.len(text)) / 250
    DrawRect(0.0, 0.0+0.0125, 0.017+ factor, 0.03, 0, 0, 0, 75)
    ClearDrawOrigin()
end

RegisterNetEvent('s4-phone:client:ctxmenu')
AddEventHandler('s4-phone:client:ctxmenu', function()
   local telefonlarx = {}
   QBCore.Functions.TriggerCallback('s4-phone:envtelefonlar', function(telefonlar)
    
    for i=1, #telefonlar, 1 do
	    
       
       if telefonlar[i].name == "phone" and  telefonlar[i].info.durum == "kilitli"  then 
		local teldata = {}
		if not telefonlar[i].info.durum then 
	     telefonlar[i].info.durum = "kilitli"
	    end
		teldata.label = telefonlar[i].info.telno.." Parmak izini sil"
		teldata.value = telefonlar[i].slot
		table.insert(telefonlarx, teldata)
	   end
	end
    telmenu(telefonlarx)
   end)
end)

function telmenu(elements)
    
	QBCore.UI.Menu.CloseAll() 
	QBCore.UI.Menu.Open('default', GetCurrentResourceName(),'ventacyc',{
		title = 'Telefonlar', 
		align = 'top-right',
		elements = elements  
	
	}, function(data, menu)
	
	for k, v in ipairs(elements) do
	   if data.current.value == v.value then 
	    menu.close()
		local ped = PlayerPedId()
        exports['mythic_progbar']:Progress({
            name = v.label,
            duration = 3250,
            label = v.label,
            useWhileDead = false,
            canCancel = true,
            controlDisables = {
                disableMovement = true,
                disableCarMovement = true,
                disableMouse = false,
                disableCombat = true,
            }
        }, function(cancelled)
            if not cancelled then
				TriggerServerEvent("s4-phone:sifrekirtelefon", v.value)
            end
        end)
	   end
	end
 
end, function(data, menu)
	menu.close()
    QBCore.Functions.Notify("Almaktan vazgeçtin!", "error")
end, function(data, menu)
end)
end


RegisterNetEvent('s4-phone:client:AddRecentCall')
AddEventHandler('s4-phone:client:AddRecentCall', function(data, time, type)
    table.insert(PhoneData.RecentCalls, {
        name = IsNumberInContacts(data.number),
        time = time,
        type = type,
        number = data.number,
        anonymous = data.anonymous
    })
    TriggerServerEvent('s4-phone:server:SetPhoneAlerts', "phone")
    Config.PhoneApplications["phone"].Alerts = Config.PhoneApplications["phone"].Alerts + 1
    SendNUIMessage({
        action = "RefreshAppAlerts",
        AppData = Config.PhoneApplications
    })
end)

RegisterNUICallback("GetCurrentArrests", function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetCurrentArrests', function(arrests)
        cb(arrests)
    end)
end)

RegisterNUICallback("GETEMS", function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GETEMS', function(x)
        cb(x)
    end)
end)


RegisterNUICallback("GetBMarket", function(data, cb)
   if lastBM2 then  
     cb(Config.BlackMarkets[lastBM2].items) 
   end
end)
wp = false
local bitem 
RegisterNUICallback("buybm", function(data, cb)
   bitem = data.x
   QBCore.Functions.TriggerCallback('s4-phone:server:buybm', function(v)
      if v then 
	    wp = false
	    WayOpen()
	    SetNewWaypoint(Config.BlackMarket_delivery.x, Config.BlackMarket_delivery.y)
	  else 
	    wp = true
	    WayOpen()
	  end
   end, data.price)
end)



WayOpen = function() 
wp = not wp
Citizen.CreateThread(function()

	while wp do 
	   	 sleepthread = 2000
	 
	     local pPed = PlayerPedId()
	     local pCoords = GetEntityCoords(pPed)
		 local distance = #(pCoords - Config.BlackMarket_delivery)
		 if distance <= 5.0 then
					sleepthread = 1
					if distance <= 1.5 then
				 
						DrawText3D(Config.BlackMarket_delivery.x , Config.BlackMarket_delivery.y  , Config.BlackMarket_delivery.z + 0.9, '[E] - Teslim al')
	   
						if IsControlJustPressed(1, 38) then
                          TriggerServerEvent('s4-phone:server:givebmitem', bitem)
						  bitem = nil
						  WayOpen()
						  Wait(1000)
						end
					end
				end
		 
		 Citizen.Wait(sleepthread)
	end 
	
end)

end



RegisterNetEvent('s4-phone:client:DosyaAl')
AddEventHandler('s4-phone:client:DosyaAl', function(data)
  SendNUIMessage({ action = "DosyaAl", veri = data  })
  SonGonderilen = data
end)

RegisterNUICallback("WifiSifreKontrol", function(data, cb)
   if lastBM2 then 
   if data.sifre == Config.BlackMarkets[lastBM2].WifiPass then 
    Wifi = false
	WifiOpen()
   else 
    Wifi = true
	WifiOpen()
   end
   else 
    Wifi = true
	WifiOpen()
   end
   cb(Config.BlackMarkets[lastBM2].WifiPass)
end)
 
RegisterNUICallback("DosyaKaydet", function(data, cb)
   if data.durum == "kaydet" then 
      TriggerServerEvent('s4-phone:server:DosyaKaydet', SonGonderilen)
   end
   Wait(200)
   SonGonderilen = {}
end)

RegisterNUICallback("DosyaGonder", function(data, cb)
	local ndata = {}
	
	ndata = {
	  firstname = PhoneData.PlayerData.charinfo.firstname,
	  lastname = PhoneData.PlayerData.charinfo.lastname,
	  resim_url = data.resim_url,
	  src = tonumber(data.src),
	}
    
	TriggerServerEvent('s4-phone:server:DosyaGonder', ndata)
end)

RegisterNUICallback("GetCurrentWeazel", function(data, cb)
 
end)

RegisterNUICallback("GetCurrentFoodCompany", function(data, cb)
    cb(Config.FoodCompany)
end)

RegisterNUICallback("GetCurrentFoodWorker", function(data, cb)
 
end)

RegisterNUICallback("disableControls", function(data)
    local count = 0
    repeat 
        count = count + 1
        Citizen.Wait(1)
        SetNuiFocusKeepInput(false)
    until (count >= 100)
    if PhoneData.isOpen then
        SetNuiFocusKeepInput(true)
    end
end)

RegisterNetEvent('QBCore:Client:OnJobUpdate')
AddEventHandler('QBCore:Client:OnJobUpdate', function(JobInfo)
    if JobInfo.name == "police" then
        SendNUIMessage({
            action = "UpdateApplications",
            JobData = JobInfo,
            applications = Config.PhoneApplications
        })
    elseif PlayerJob.name == "police" and JobInfo.name == "unemployed" then
        SendNUIMessage({
            action = "UpdateApplications",
            JobData = JobInfo,
            applications = Config.PhoneApplications
        })
    end

    PlayerJob = JobInfo
end)

RegisterNUICallback("UpdateSoundStatus", function(data, cb)
    PhoneData.Sounds = data.sound
    cb("ok")
end)

RegisterNUICallback('ClearRecentAlerts', function(data, cb)
    TriggerServerEvent('s4-phone:server:SetPhoneAlerts', "phone", 0)
    Config.PhoneApplications["phone"].Alerts = 0
    SendNUIMessage({ action = "RefreshAppAlerts", AppData = Config.PhoneApplications })
end)

RegisterNUICallback('SetBackground', function(data)
    local background = data.background

    TriggerServerEvent('s4-phone:server:SaveMetaData', 'background', background)
end)


RegisterNUICallback('s4share', function(data)
    TriggerServerEvent('s4-phone:server:s4share', data.veri)
end)

RegisterNUICallback('s4shareGET', function(data, cb)
	QBCore.Functions.TriggerCallback('s4-phone:server:GetS4Share', function(users)
        cb(users)
    end)
end)

RegisterNUICallback("UpdateAvailableStatus", function(data, cb)
    TriggerServerEvent("s4-phone:UpdateAvailableStatus", data.available)
    cb("ok")
end)

RegisterNUICallback('GetMissedCalls', function(data, cb)
    cb(PhoneData.RecentCalls)
end)

RegisterNUICallback('GetSuggestedContacts', function(data, cb)
    cb(PhoneData.SuggestedContacts)
end)

function IsNumberInContacts(num)
    local retval = num
    for _, v in pairs(PhoneData.Contacts) do
        if num == v.number then
            retval = v.name
        end
    end
    return retval
end

local isLoggedIn = false

Citizen.CreateThread(function()
    while true do
        if IsControlJustPressed(0, Config.OpenPhone) then
            if not PhoneData.isOpen then
               if old_tel and old_parmak and old_durum then  
			     OpenPhone(old_tel ,old_parmak, old_durum)
			   end
            end
        end
        if PhoneData.isOpen then
            DisableControlAction(0, 24, true) -- Attack
			DisableControlAction(0, 29, true)
            DisableControlAction(0, 257, true) -- Attack 2
            DisableControlAction(0, 25, true) -- Aim
            DisableControlAction(0, 263, true) -- Melee Attack 1

            DisableControlAction(0, 45, true) -- Reload
            DisableControlAction(0, 21, true) -- left shift
            DisableControlAction(0, 22, true) -- Jump
            DisableControlAction(0, 44, true) -- Cover
            DisableControlAction(0, 37, true) -- Select Weapon

            DisableControlAction(0, 288,  true) -- Disable phone
            DisableControlAction(0, 245,  true) -- Disable chat
            DisableControlAction(0, 289, true) -- Inventory
            DisableControlAction(0, 170, true) -- Animations
            DisableControlAction(0, 167, true) -- Job
            DisableControlAction(0, 244, true) -- Ragdoll
            DisableControlAction(0, 303, true) -- Car lock

            DisableControlAction(0, 29, true) -- B ile işaret
            DisableControlAction(0, 81, true) -- B ile işaret
            DisableControlAction(0, 26, true) -- Disable looking behind
            DisableControlAction(0, 73, true) -- Disable clearing animation
            DisableControlAction(2, 199, true) -- Disable pause screen

            -- DisableControlAction(0, 71, true) -- Disable driving forward in vehicle
            -- DisableControlAction(0, 72, true) -- Disable reversing in vehicle

            DisableControlAction(2, 36, true) -- Disable going stealth

            DisableControlAction(0, 47, true)  -- Disable weapon
            DisableControlAction(0, 264, true) -- Disable melee
            DisableControlAction(0, 257, true) -- Disable melee
            DisableControlAction(0, 140, true) -- Disable melee
            DisableControlAction(0, 141, true) -- Disable melee
            DisableControlAction(0, 142, true) -- Disable melee
        end
        Citizen.Wait(3)
    end
end)


function CalculateTimeToDisplay()
        hour = GetClockHours()
    minute = GetClockMinutes()

    local obj = {}

        if minute <= 9 then
                minute = "0" .. minute
    end

    obj.hour = hour
    obj.minute = minute

    return obj
end

Citizen.CreateThread(function()
    while true do
        if PhoneData.isOpen then
            SendNUIMessage({
                action = "UpdateTime",
                InGameTime = CalculateTimeToDisplay(),
            })
        end
        Citizen.Wait(1000)
    end
end)




Citizen.CreateThread(function()
    while true do
        Citizen.Wait(60000)
        if isLoggedIn then
            QBCore.Functions.TriggerCallback('s4-phone:server:GetPhoneData', function(pData)
                if pData.PlayerContacts ~= nil and next(pData.PlayerContacts) ~= nil then
                    PhoneData.Contacts = pData.PlayerContacts
                end
                SendNUIMessage({
                    action = "RefreshContacts",
                    Contacts = PhoneData.Contacts
                })
            end)
        end
    end
end)

function test()
    for j = 1, #PhoneData.Tweets do
        local TwitterMessage = PhoneData.Tweets[j].message
        local MentionTag = TwitterMessage:split("@")
        for i = 2, #MentionTag, 1 do
            local Handle = MentionTag[i]:split(" ")[1]
            if Handle ~= nil or Handle ~= "" then
                local Fullname = Handle:split("_")
                local Firstname = Fullname[1]
                table.remove(Fullname, 1)
                local Lastname = table.concat(Fullname, " ")
                if (Firstname ~= nil and Firstname ~= "") and (Lastname ~= nil and Lastname ~= "") then
                    --print(PhoneData.Tweets[j].message)
                    TriggerServerEvent('s4-phone:server:MentionedPlayer', Firstname, Lastname, PhoneData.Tweets[j])
                end
            end
        end
    end
    QBCore.Functions.TriggerCallback('s4-phone:server:GetPhoneData', function(pData)
        if pData.MentionedTweets ~= nil and next(pData.MentionedTweets) ~= nil then
            PhoneData.MentionedTweets = pData.MentionedTweets
        end
    end)

end

function LoadPhone()
    Citizen.Wait(100)
    isLoggedIn = true
	 
    QBCore.Functions.TriggerCallback('s4-phone:server:GetPhoneData', function(pData)
        PlayerJob = QBCore.Functions.GetPlayerData().job
        PhoneData.MetaData = {}
        PhoneData.PlayerData.charinfo = pData.charinfo ~= nil and pData.charinfo or {}
        PhoneData.PlayerData.citizenid = pData.charinfo ~= nil and pData.charinfo.citizenid or ""
        PhoneData.PlayerData = QBCore.Functions.GetPlayerData()
        local PhoneMeta = PhoneData.PlayerData.metadata["phone"]
        PhoneData.MetaData = PhoneMeta

        if PhoneData.PlayerData.charinfo.profilepicture == nil then
            PhoneData.MetaData.profilepicture = "default"
        else
            PhoneData.MetaData.profilepicture = PhoneData.PlayerData.charinfo.profilepicture
        end

        if PhoneData.PlayerData.charinfo.background ~= nil then
            PhoneData.MetaData.background = PhoneData.PlayerData.charinfo.background
        end

        if pData.Applications ~= nil and next(pData.Applications) ~= nil then
            for k, v in pairs(pData.Applications) do
                Config.PhoneApplications[k].Alerts = v
            end
        end

        if pData.PlayerContacts ~= nil and next(pData.PlayerContacts) ~= nil then
            PhoneData.Contacts = pData.PlayerContacts
        end

        if pData.Chats ~= nil and next(pData.Chats) ~= nil then
            local Chats = {}
            for k, v in pairs(pData.Chats) do
                Chats[v.number] = {
                    name = IsNumberInContacts(v.number),
                    number = v.number,
                    messages = json.decode(v.messages)
                }
            end

            PhoneData.Chats = Chats
        end

        if pData.Invoices ~= nil and next(pData.Invoices) ~= nil then
            for _, invoice in pairs(pData.Invoices) do
                invoice.name = IsNumberInContacts(invoice.number)
            end
            PhoneData.Invoices = pData.Invoices
        end

        if pData.Hashtags ~= nil and next(pData.Hashtags) ~= nil then
            PhoneData.Hashtags = pData.Hashtags
        end
        if pData.Tweets ~= nil then
            PhoneData.Tweets = pData.Tweets
            PhoneData.id = pData.Tweets[#pData.Tweets].id + 1
        end

        if pData.SelfTweets ~= nil then
            PhoneData.SelfTweets = pData.SelfTweets
        end

        if pData.Mails ~= nil and next(pData.Mails) ~= nil then
            PhoneData.Mails = pData.Mails
        end

        if pData.Adverts ~= nil and next(pData.Adverts) ~= nil then
            PhoneData.Adverts = pData.Adverts
        end

        if pData.CryptoTransactions ~= nil and next(pData.CryptoTransactions) ~= nil then
            PhoneData.CryptoTransactions = pData.CryptoTransactions
        end

        Citizen.Wait(300)

        SendNUIMessage({ 
            action = "LoadPhoneData", 
            PhoneData = PhoneData, 
            PlayerData = PhoneData.PlayerData,
            PlayerJob = PhoneData.PlayerData.job,
            applications = Config.PhoneApplications 
        })

      

    end, old_parmak)
	 
    Citizen.Wait(2000)

end



RegisterNetEvent("s4-phone:client:telefon")
AddEventHandler("s4-phone:client:telefon", function(tel, parmak, durum)
   old_tel = tel
   old_parmak = parmak
   old_durum = durum
   OpenPhone(old_tel ,old_parmak, old_durum)
   LoadPhone()
end)

 
RegisterNUICallback('HasPhone', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:HasPhone', function(HasPhone)
         cb(HasPhone)
     end)
 end)

RegisterCommand("telfix", function()
    if not PhoneData.CallData.InCall then
        DoPhoneAnimation('cellphone_text_out')
        SetTimeout(400, function()
            StopAnimTask(PlayerPedId(), PhoneData.AnimationData.lib, PhoneData.AnimationData.anim, 2.5)
            deletePhone()
            PhoneData.AnimationData.lib = nil
            PhoneData.AnimationData.anim = nil
        end)
    else
        PhoneData.AnimationData.lib = nil
        PhoneData.AnimationData.anim = nil
        DoPhoneAnimation('cellphone_text_to_call')
    end
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    phone = false
    SetTimeout(1000, function()
        PhoneData.isOpen = false
    end)
	
	
	if not PhoneData.CallData.InCall then
        DoPhoneAnimation('cellphone_text_out')
        SetTimeout(400, function()
            StopAnimTask(PlayerPedId(), PhoneData.AnimationData.lib, PhoneData.AnimationData.anim, 2.5)
            deletePhone()
            PhoneData.AnimationData.lib = nil
            PhoneData.AnimationData.anim = nil
        end)
    else
        PhoneData.AnimationData.lib = nil
        PhoneData.AnimationData.anim = nil
        DoPhoneAnimation('cellphone_text_to_call')
    end
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    phone = false
    SetTimeout(1000, function()
        PhoneData.isOpen = false
	 SendNUIMessage({  action = "close" })
    end)
end)


RegisterCommand("telver", function(source, args, rawCommand)
   TriggerServerEvent('s4-phone:telver', source)
end)

 local phone = false
 function OpenPhone(x, y, z)
     --    if exports["esx_ambulancejob"]:GetDeath() == false then 
         QBCore.Functions.TriggerCallback('s4-phone:server:HasPhone', function(HasPhone)
             if HasPhone then 
			     PhoneData.isOpen = true
                 QBCore.Functions.TriggerCallback('s4-phone:server:GetCharacterData', function(chardata)
                     PhoneData.PlayerData = QBCore.Functions.GetPlayerData()
                     PhoneData.PlayerData.charinfo = chardata ~= nil and chardata or {}
                     PhoneData.PlayerData.citizenid = chardata ~= nil and chardata.citizenid or {}
 
                     SetNuiFocus(true, true)
                     SetNuiFocusKeepInput(true)
 
                     SendNUIMessage({
                        action = "open",
                        Tweets = PhoneData.Tweets,
                        AppData = Config.PhoneApplications,
                        CallData = PhoneData.CallData,
                        PlayerData = PhoneData.PlayerData,
						 s4meta = { tel = x , id = y, durum = z  } 
                     })
 
 
              
                     
                     PhoneData.isOpen = true
 
                     if not PhoneData.CallData.InCall then
                         DoPhoneAnimation('cellphone_text_in')
                     else
                         DoPhoneAnimation('cellphone_call_to_text')
                     end
 
                     SetTimeout(250, function()
                         newPhoneProp()
                     end)
                     phone = true
                     -- Garage Fix
                     QBCore.Functions.TriggerCallback('s4-phone:server:GetGarageVehicles', function(vehicles)
                        PhoneData.GarageVehicles = vehicles
                    end)
                 end)
             else
                QBCore.Functions.Notify("Telefonun Yok", "error")
            end
         end)
      --   end
 end

RegisterNUICallback('SetupGarageVehicles', function(data, cb)
    cb(PhoneData.GarageVehicles)
end)



RegisterNUICallback('GetirNotlar', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetNotlar', function(Notlar)
        cb(Notlar)
    end)
end)

--RegisterNUICallback('LoadAdverts', function()
--    SendNUIMessage({
--        action = "RefreshAdverts",
--        Adverts = PhoneData.Adverts
--    })
--end)

RegisterNUICallback('LoadAdverts', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:LoadAdverts', function(Adverts)
        cb(Adverts)
    end)
end)


RegisterNUICallback('GetirinstaResimleri', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetGalerinsta', function(Resimler)
        cb(Resimler)
    end, data.owner)
end)

--[[RegisterNUICallback('GetirinstaResimleri', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetGaleri', function(Resimler)
        cb(Resimler)
    end, data.owner)
end)]]--

RegisterNUICallback('GetirinstaProfilBilgi', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetirinstaProfilBilgi', function(Bilgi)
        cb(Bilgi)
    end, data.owner)
end)

RegisterNUICallback('GetirGaleriResimleri', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetGaleri', function(Bilgi)
		cb(Bilgi)
    end)
end)


RegisterNUICallback('GetirInstaZamanTuneli', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetirInstaZamanTuneli', function(Resimler)
	  
		cb(Resimler)
    end)
end)

RegisterNUICallback('GetirInstaZamanTuneli', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetirInstaZamanTuneli', function(Resimler)
		cb(Resimler)
    end)
end)

RegisterNUICallback('InstagramHesaplari', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:InstagramHesaplari', function(Hesaplar)
        cb(Hesaplar)
    end)
end)

RegisterNUICallback('TamEkranKapat', function(data, cb)
     SendNUIMessage({ action = "TamEkranKapat" })
end)

RegisterNUICallback('TamEkranGecis', function(data, cb)
    SendNUIMessage({ action = "TamEkranGecis" })
end)


RegisterNUICallback('ResimSil', function(data, cb)
     TriggerServerEvent("s4-phone:server:SilResim", data.resim_url)
end)

RegisterNUICallback('ResimSilinsta', function(data, cb)
     TriggerServerEvent("s4-phone:server:ResimSilinsta", data.resim_url)
end)

RegisterNUICallback('PaylasInstaPost', function(data, cb)
    TriggerServerEvent("s4-phone:server:PaylasInstaPost", data.eskiResim, data.eskiEfekt, data.yazi)
end)

RegisterNUICallback('NotEkle', function(data, cb)
     TriggerServerEvent("s4-phone:server:NotEkle", data.baslik, data.aciklama)
end)

RegisterNUICallback('NotSil', function(data, cb)
     TriggerServerEvent("s4-phone:server:NotSil", data.id)
end)

RegisterNUICallback('NotGuncelle', function(data, cb)
     TriggerServerEvent("s4-phone:server:NotGuncelle", data.id, data.baslik, data.aciklama)
end)

RegisterNUICallback('Takip_instagram', function(data, cb)
     TriggerServerEvent("s4-phone:server:Takip_instagram", data.takip, data.takip_edilen)
end)


RegisterNUICallback('FotoGaleriKayit', function(data, cb)
     TriggerServerEvent("s4-phone:server:kaydetResim", data.resim_url)
end)

RegisterNUICallback('biyoguncelle', function(data, cb)
     TriggerServerEvent("s4-phone:server:biyoguncelle", data.biyografi)
end)

RegisterNUICallback('BildirimManager', function(data, cb)
     SendNUIMessage({ action = "BildirimManager", bildirim = data })
end)

RegisterNUICallback('Close', function()
    if not PhoneData.CallData.InCall then
        DoPhoneAnimation('cellphone_text_out')
        SetTimeout(400, function()
            StopAnimTask(PlayerPedId(), PhoneData.AnimationData.lib, PhoneData.AnimationData.anim, 2.5)
            deletePhone()
            PhoneData.AnimationData.lib = nil
            PhoneData.AnimationData.anim = nil
        end)
    else
        PhoneData.AnimationData.lib = nil
        PhoneData.AnimationData.anim = nil
        DoPhoneAnimation('cellphone_text_to_call')
    end
    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    phone = false
    SetTimeout(1000, function()
        PhoneData.isOpen = false
	 
    end)
	
end)

RegisterNUICallback('RemoveMail', function(data, cb)
    local MailId = data.mailId

    TriggerServerEvent('s4-phone:server:RemoveMail', MailId)
    cb('ok')
end)

RegisterNetEvent('s4-phone:client:UpdateMails')
AddEventHandler('s4-phone:client:UpdateMails', function(NewMails)
    SendNUIMessage({
        action = "UpdateMails",
        Mails = NewMails
    })
    PhoneData.Mails = NewMails
end)

RegisterNUICallback('AcceptMailButton', function(data)
    TriggerEvent(data.buttonEvent, data.buttonData)
    TriggerServerEvent('s4-phone:server:ClearButtonData', data.mailId)
end)
RegisterNUICallback('AddNewContact', function(data, cb)
    table.insert(PhoneData.Contacts, {
        name = data.ContactName,
        number = data.ContactNumber,
        iban = data.ContactIban
    })
    Citizen.Wait(100)
    cb(PhoneData.Contacts)
    if PhoneData.Chats[data.ContactNumber] ~= nil and next(PhoneData.Chats[data.ContactNumber]) ~= nil then
        PhoneData.Chats[data.ContactNumber].name = data.ContactName
    end
    TriggerServerEvent('s4-phone:server:AddNewContact', data.ContactName, data.ContactNumber, data.ContactIban)
end)

RegisterNUICallback('GetMails', function(data, cb)
    cb(PhoneData.Mails)
end)

RegisterNUICallback('GetWhatsappChat', function(data, cb)
    if PhoneData.Chats[data.phone] ~= nil then
        cb(PhoneData.Chats[data.phone])
    else
        cb(false)
    end
end)

RegisterNUICallback('GetProfilePicture', function(data, cb)
    local number = data.number

    QBCore.Functions.TriggerCallback('s4-phone:server:GetPicture', function(picture)
        cb(picture)
    end, number)
end)

RegisterNUICallback('GetBankContacts', function(data, cb)
    cb(PhoneData.Contacts)
end)

RegisterNUICallback('GetBankData', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetBankData', cb)
end)

--[[
RegisterNUICallback('GetInvoices', function(data, cb)
 
    QBCore.Functions.TriggerCallback('s4-phone:server:GetInvoices',function(data)
        PhoneData.Invoices = data
        cb(data)
    end)
end)
--]]

RegisterNUICallback('GetInvoices', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetInvoices', function(Bilgi)
		cb(Bilgi)
    end)
end)

function GetKeyByDate(Number, Date)
    local retval = nil
    if PhoneData.Chats[Number] ~= nil then
        if PhoneData.Chats[Number].messages ~= nil then
            for key, chat in pairs(PhoneData.Chats[Number].messages) do
                if chat.date == Date then
                    retval = key
                    break
                end
            end
        end
    end
    return retval
end

function GetKeyByNumber(Number)
    local retval = tostring(Number)
    if PhoneData.Chats then
        for k, v in pairs(PhoneData.Chats) do
            if v.number == Number then
                retval = k
            end
        end
    end
    return retval
end

function ReorganizeChats(key)
    local ReorganizedChats = {}
    ReorganizedChats[1] = PhoneData.Chats[key]
    for k, chat in pairs(PhoneData.Chats) do
        if k ~= key then
            table.insert(ReorganizedChats, chat)
        end
    end
    PhoneData.Chats = ReorganizedChats
end


RegisterNetEvent('S4.PHONE.C.SM')
AddEventHandler('S4.PHONE.C.SM', function(data, tip)
    mesaj_gonder(data) 
end)


RegisterNUICallback('SendMessage', function(data, cb)
    mesaj_gonder(data) 
end)


function mesaj_gonder(data) 
    
    local ChatMessage = data.ChatMessage
    local ChatDate = data.ChatDate
    local ChatNumber = data.ChatNumber
    local ChatTime = data.ChatTime
    local ChatType = data.ChatType

    local Ped = PlayerPedId()
    local Pos = GetEntityCoords(Ped)
    local NumberKey = GetKeyByNumber(ChatNumber)
    local ChatKey = GetKeyByDate(NumberKey, ChatDate)

    if PhoneData.Chats[NumberKey] ~= nil then
        if PhoneData.Chats[NumberKey].messages[ChatKey] ~= nil then
            if ChatType == "message" then
                table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                    message = ChatMessage,
                    time = ChatTime,
                    sender = PhoneData.PlayerData.identifier,
                    type = ChatType,
                    data = {},
                })
            elseif ChatType == "location" then
                table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                    message = Lang("WHATSAPP_SHARED_LOCATION"),
                    time = ChatTime,
                    sender = PhoneData.PlayerData.identifier,
                    type = ChatType,
                    data = {
                        x = Pos.x,
                        y = Pos.y,
                    },
                })
			elseif ChatType == "foto" then
			    table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                    message = ChatMessage,
                    time = ChatTime,
                    sender = PhoneData.PlayerData.identifier,
                    type = ChatType,
                    data = {},
                })
			elseif ChatType == "gif" then
			    table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                    message = ChatMessage,
                    time = ChatTime,
                    sender = PhoneData.PlayerData.identifier,
                    type = ChatType,
                    data = {},
                })
            end
            TriggerServerEvent('s4-phone:server:UpdateMessages', PhoneData.Chats[NumberKey].messages, ChatNumber, false)
            NumberKey = GetKeyByNumber(ChatNumber)
            ReorganizeChats(NumberKey)
        else
            table.insert(PhoneData.Chats[NumberKey].messages, {
                date = ChatDate,
                messages = {},
            })
            ChatKey = GetKeyByDate(NumberKey, ChatDate)
            if ChatType == "message" then
                table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                    message = ChatMessage,
                    time = ChatTime,
                    sender = PhoneData.PlayerData.identifier,
                    type = ChatType,
                    data = {},
                })
            elseif ChatType == "location" then
                table.insert(PhoneData.Chats[NumberKey].messages[ChatDate].messages, {
                    message = Lang("WHATSAPP_SHARED_LOCATION"),
                    time = ChatTime,
                    sender = PhoneData.PlayerData.identifier,
                    type = ChatType,
                    data = {
                        x = Pos.x,
                        y = Pos.y,
                    },
                })
			elseif ChatType == "foto" then
			    table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                    message = ChatMessage,
                    time = ChatTime,
                    sender = PhoneData.PlayerData.identifier,
                    type = ChatType,
                    data = {},
                })
			elseif ChatType == "gif" then
			    table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                    message = ChatMessage,
                    time = ChatTime,
                    sender = PhoneData.PlayerData.identifier,
                    type = ChatType,
                    data = {},
                })
            end
            TriggerServerEvent('s4-phone:server:UpdateMessages', PhoneData.Chats[NumberKey].messages, ChatNumber, true)
            NumberKey = GetKeyByNumber(ChatNumber)
            ReorganizeChats(NumberKey)
        end
    else
        table.insert(PhoneData.Chats, {
            name = IsNumberInContacts(ChatNumber),
            number = ChatNumber,
            messages = {},
        })
        NumberKey = GetKeyByNumber(ChatNumber)
        table.insert(PhoneData.Chats[NumberKey].messages, {
            date = ChatDate,
            messages = {},
        })
        ChatKey = GetKeyByDate(NumberKey, ChatDate)
        if ChatType == "message" then
            table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                message = ChatMessage,
                time = ChatTime,
                sender = PhoneData.PlayerData.identifier,
                type = ChatType,
                data = {},
            })
        elseif ChatType == "location" then
            table.insert(PhoneData.Chats[NumberKey].messages[ChatKey].messages, {
                message = Lang("WHATSAPP_SHARED_LOCATION"),
                time = ChatTime,
                sender = PhoneData.PlayerData.identifier,
                type = ChatType,
                data = {
                    x = Pos.x,
                    y = Pos.y,
                },
            })
        end
        TriggerServerEvent('s4-phone:server:UpdateMessages', PhoneData.Chats[NumberKey].messages, ChatNumber, true)
        NumberKey = GetKeyByNumber(ChatNumber)
        ReorganizeChats(NumberKey)
    end

    QBCore.Functions.TriggerCallback('s4-phone:server:GetContactPicture', function(Chat)
        SendNUIMessage({
            action = "UpdateChat",
            chatData = Chat,
            chatNumber = ChatNumber,
        })
    end,  PhoneData.Chats[GetKeyByNumber(ChatNumber)])
	
end


RegisterNUICallback('setwp', function(data)  SetNewWaypoint(tonumber(data.x), tonumber(data.y)) end)


RegisterNUICallback('SharedLocation', function(data)
    local x = data.coords.x
    local y = data.coords.y

    SetNewWaypoint(x, y)
    SendNUIMessage({
        action = "PhoneNotification",
        PhoneNotify = {
            title = Lang("WHATSAPP_TITLE"),
            text = Lang("WHATSAPP_LOCATION_SET"),
            icon = "fab fa-whatsapp",
            color = "#25D366",
            timeout = 1500,
        },
    })
end)

RegisterNetEvent('s4-phone:client:UpdateMessages')
AddEventHandler('s4-phone:client:UpdateMessages', function(ChatMessages, SenderNumber, New)
    local Sender = IsNumberInContacts(SenderNumber)
    local NumberKey = GetKeyByNumber(SenderNumber)
    if New then
        PhoneData.Chats[NumberKey] = {
            name = IsNumberInContacts(SenderNumber),
            number = SenderNumber,
            messages = ChatMessages
        }

        if PhoneData.Chats[NumberKey].Unread ~= nil then
            PhoneData.Chats[NumberKey].Unread = PhoneData.Chats[NumberKey].Unread + 1
        else
            PhoneData.Chats[NumberKey].Unread = 1
        end

        if PhoneData.isOpen then
            if SenderNumber ~= PhoneData.PlayerData.charinfo.phone then
                SendNUIMessage({
                    action = "PhoneNotification",
                    PhoneNotify = {
                        title = Lang("WHATSAPP_TITLE"),
                        text = Lang("WHATSAPP_NEW_MESSAGE") .. " "..IsNumberInContacts(SenderNumber).."!",
                        icon = "fab fa-whatsapp",
                        color = "#25D366",
                        timeout = 1500,
                    },
                })
            else
                SendNUIMessage({
                    action = "PhoneNotification",
                    PhoneNotify = {
                        title = Lang("WHATSAPP_TITLE"),
                        text = Lang("WHATSAPP_MESSAGE_TOYOU"),
                        icon = "fab fa-whatsapp",
                        color = "#25D366",
                        timeout = 4000,
                    },
                })
            end

            NumberKey = GetKeyByNumber(SenderNumber)
            ReorganizeChats(NumberKey)

            Wait(100)
            print('updatechats new')
            QBCore.Functions.TriggerCallback('s4-phone:server:GetContactPictures', function(Chats)
                SendNUIMessage({
                    action = "UpdateChat",
                    chatData = Chats[GetKeyByNumber(SenderNumber)],
                    chatNumber = SenderNumber,
                    Chats = Chats,
                })
            end,  PhoneData.Chats)
        else
            SendNUIMessage({
                action = "Notification",
                NotifyData = {
                    title = Lang("TWITTER_TITLE"),
                    content = Lang("WHATSAPP_NEW_MESSAGE") .. " "..IsNumberInContacts(SenderNumber).."!",
                    icon = "fab fa-whatsapp",
                    timeout = 3500,
                    color = "#25D366",
                },
            })
            Config.PhoneApplications['whatsapp'].Alerts = Config.PhoneApplications['whatsapp'].Alerts + 1
            TriggerServerEvent('s4-phone:server:SetPhoneAlerts', "whatsapp")
        end
    else
        PhoneData.Chats[NumberKey].messages = ChatMessages

        if PhoneData.Chats[NumberKey].Unread ~= nil then
            PhoneData.Chats[NumberKey].Unread = PhoneData.Chats[NumberKey].Unread + 1
        else
            PhoneData.Chats[NumberKey].Unread = 1
        end

        if PhoneData.isOpen then
            if SenderNumber ~= PhoneData.PlayerData.charinfo.phone then
                SendNUIMessage({
                    action = "PhoneNotification",
                    PhoneNotify = {
                        title = Lang("WHATSAPP_TITLE"),
                        text = Lang("WHATSAPP_NEW_MESSAGE") .. " " ..IsNumberInContacts(SenderNumber).."!",
                        icon = "fab fa-whatsapp",
                        color = "#25D366",
                        timeout = 1500,
                    },
                })
            else
                SendNUIMessage({
                    action = "PhoneNotification",
                    PhoneNotify = {
                        title = Lang("WHATSAPP_TITLE"),
                        text = Lang("WHATSAPP_MESSAGE_TOYOU"),
                        icon = "fab fa-whatsapp",
                        color = "#25D366",
                        timeout = 4000,
                    },
                })
            end

            NumberKey = GetKeyByNumber(SenderNumber)
            ReorganizeChats(NumberKey)

            Wait(100)
            print('updatechats old')
            QBCore.Functions.TriggerCallback('s4-phone:server:GetContactPictures', function(Chats)
                SendNUIMessage({
                    action = "UpdateChat",
                    chatData = Chats[GetKeyByNumber(SenderNumber)],
                    chatNumber = SenderNumber,
                    Chats = Chats,
                })
            end,  PhoneData.Chats)
        else
            SendNUIMessage({
                action = "Notification",
                NotifyData = {
                    title = "Whatsapp",
                    content = Lang("WHATSAPP_NEW_MESSAGE") .. " "..IsNumberInContacts(SenderNumber).."!",
                    icon = "fab fa-whatsapp",
                    timeout = 3500,
                    color = "#25D366",
                },
            })

            NumberKey = GetKeyByNumber(SenderNumber)
            ReorganizeChats(NumberKey)

            Config.PhoneApplications['whatsapp'].Alerts = Config.PhoneApplications['whatsapp'].Alerts + 1
            TriggerServerEvent('s4-phone:server:SetPhoneAlerts', "whatsapp")
        end
    end
end)

RegisterNetEvent("s4-phone:client:BankNotify")
AddEventHandler("s4-phone:client:BankNotify", function(text)
    --print('wow')
    SendNUIMessage({
        action = "Notification",
        NotifyData = {
            title = Lang("BANK_TITLE"),
            content = text,
            icon = "fas fa-university",
            timeout = 3500,
            color = "#ff002f",
        },
    })
end)

Citizen.CreateThread(function()
    while true do
        if PhoneData.isOpen then
            SendNUIMessage({
                action = "updateTweets",
                tweets = PhoneData.Tweets,
                selfTweets = PhoneData.SelfTweets,
            })
        end
        Citizen.Wait(2000)
    end
end)

RegisterNetEvent('s4-phone:client:NewMailNotify')
AddEventHandler('s4-phone:client:NewMailNotify', function(MailData)
    if PhoneData.isOpen then
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("MAIL_TITLE"),
                text = Lang("MAIL_NEW") .. " " .. MailData.sender,
                icon = "fas fa-envelope",
                color = "#ff002f",
                timeout = 1500,
            },
        })
    else
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang("MAIL_TITLE"),
                content = Lang("MAIL_NEW") .. " " .. MailData.sender,
                icon = "fas fa-envelope",
                timeout = 3500,
                color = "#ff002f",
            },
        })
    end
    Config.PhoneApplications['mail'].Alerts = Config.PhoneApplications['mail'].Alerts + 1
    TriggerServerEvent('s4-phone:server:SetPhoneAlerts', "mail")
end)

RegisterNUICallback('PostAdvert', function(data)
    TriggerServerEvent('s4-phone:server:AddAdvert', data.message, data.cekilmis_foto)
end)

RegisterNetEvent('s4-phone:client:UpdateAdverts')
AddEventHandler('s4-phone:client:UpdateAdverts', function(Adverts, LastAd)
    PhoneData.Adverts = Adverts

    if PhoneData.isOpen then
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("ADVERTISEMENT_TITLE"),
                text = Lang("ADVERTISEMENT_NEW") .. " " .. LastAd,
                icon = "fas fa-ad",
                color = "#ff8f1a",
                timeout = 2500,
            },
        })
    else
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang("ADVERTISEMENT_TITLE"),
                content = Lang("ADVERTISEMENT_NEW") .. " " .. LastAd,
                icon = "fas fa-ad",
                timeout = 2500,
                color = "#ff8f1a",
            },
        })
    end

    SendNUIMessage({
        action = "RefreshAdverts",
        Adverts = PhoneData.Adverts
    })
end)



RegisterNUICallback('ClearAlerts', function(data, cb)
    local chat = data.number
    local ChatKey = GetKeyByNumber(chat)

    if PhoneData.Chats[ChatKey].Unread ~= nil then
        local newAlerts = (Config.PhoneApplications['whatsapp'].Alerts - PhoneData.Chats[ChatKey].Unread)
        Config.PhoneApplications['whatsapp'].Alerts = newAlerts
        TriggerServerEvent('s4-phone:server:SetPhoneAlerts', "whatsapp", newAlerts)

        PhoneData.Chats[ChatKey].Unread = 0

        SendNUIMessage({
            action = "RefreshWhatsappAlerts",
            Chats = PhoneData.Chats,
        })
        SendNUIMessage({ action = "RefreshAppAlerts", AppData = Config.PhoneApplications })
    end
end)

RegisterNUICallback('PayInvoice', function(data, cb)
    local sender = data.sender
    local amount = data.amount
	TriggerServerEvent("s4-phone:server:PayBilling", data.invoiceId)
	cb(true)
 --[[   QBCore.Functions.TriggerCallback('s4-phone:server:CanPayInvoice', function(CanPay)
        if CanPay then
            PayInvoice(cb,invoiceId)
        else
            cb(false)
        end
    end, amount) ]]
end)

function PayInvoice(cb,invoiceId)
    cb(true)
    QBCore.Functions.TriggerCallback('esx_billing:payBill', function()
        QBCore.Functions.TriggerCallback('s4-phone:server:GetInvoices', function(Invoices)
            PhoneData.Invoices = Invoices
        end)
    end, invoiceId)
end

RegisterNUICallback('DeclineInvoice', function(data, cb)
    local sender = data.sender
    local amount = data.amount
    local invoiceId = data.invoiceId

    QBCore.Functions.TriggerCallback('s4-phone:server:DeclineInvoice', function(CanPay, Invoices)
        PhoneData.Invoices = Invoices
        cb('ok')
    end, sender, amount, invoiceId)
end)

RegisterNUICallback('EditContact', function(data, cb)
    local NewName = data.CurrentContactName
    local NewNumber = data.CurrentContactNumber
    local NewIban = data.CurrentContactIban
    local OldName = data.OldContactName
    local OldNumber = data.OldContactNumber
    local OldIban = data.OldContactIban

    for k, v in pairs(PhoneData.Contacts) do
        if v.name == OldName and v.number == OldNumber then
            v.name = NewName
            v.number = NewNumber
            v.iban = NewIban
        end
    end
    if PhoneData.Chats[NewNumber] ~= nil and next(PhoneData.Chats[NewNumber]) ~= nil then
        PhoneData.Chats[NewNumber].name = NewName
    end
    Citizen.Wait(100)
    cb(PhoneData.Contacts)
    TriggerServerEvent('s4-phone:server:EditContact', NewName, NewNumber, NewIban, OldName, OldNumber, OldIban)
end)

function GenerateTweetId()
    local tweetId = "TWEET-"..math.random(11111111, 99999999)
    return tweetId
end

RegisterNetEvent('s4-phone:client:UpdateHashtags')
AddEventHandler('s4-phone:client:UpdateHashtags', function(Handle, msgData)
    if PhoneData.Hashtags[Handle] ~= nil then
        table.insert(PhoneData.Hashtags[Handle].messages, msgData)
    else
        PhoneData.Hashtags[Handle] = {
            hashtag = Handle,
            messages = {}
        }
        table.insert(PhoneData.Hashtags[Handle].messages, msgData)
    end

    SendNUIMessage({
        action = "UpdateHashtags",
        Hashtags = PhoneData.Hashtags,
    })
end)

RegisterNUICallback('GetHashtagMessages', function(data, cb)
    if PhoneData.Hashtags[data.hashtag] ~= nil and next(PhoneData.Hashtags[data.hashtag]) ~= nil then
        cb(PhoneData.Hashtags[data.hashtag])
    else
        cb(nil)
    end
end)

local function getIndex(tab, val)
    local index = nil
    for i, v in ipairs (tab) do
        if (v.id == val) then
          index = i
        end
    end
    return index
end

exports('isphoneopened', function()
    return phone
end)


RegisterNUICallback('isInHomePage', function(data, cb)

end)

RegisterNUICallback('DeleteTweet', function(data, cb)
    TriggerServerEvent("s4-phone:deleteTweet", data.id)
    local idx = getIndex(PhoneData.SelfTweets, data.id)
    local idx2 = getIndex(PhoneData.Tweets, data.id)

    table.remove(PhoneData.SelfTweets,idx)
    table.remove(PhoneData.Tweets,idx2)
    TriggerServerEvent('s4-phone:server:updateForEveryone', PhoneData.Tweets)
end)

RegisterNUICallback('GetTweets', function(data, cb)
    cb(PhoneData.Tweets)

end)

RegisterNUICallback('GetSelfTweets', function(data, cb)
    cb(PhoneData.SelfTweets)
end)


RegisterNUICallback('UpdateProfilePicture', function(data)
    local pf = data.profilepicture

    TriggerServerEvent('s4-phone:server:SaveMetaData', 'profilepicture', pf)
end)
local test

local patt = "[?!@#]"

RegisterNetEvent("s4-phone:updateForEveryone")
AddEventHandler("s4-phone:updateForEveryone", function(newTweet)
    PhoneData.Tweets = newTweet
end)

RegisterNetEvent("s4-phone:updateidForEveryone")
AddEventHandler("s4-phone:updateidForEveryone", function()
    PhoneData.id  = PhoneData.id + 1
end)

-- Deobfuscated by XenoS.єχє#2859 | FireLeaf - Anticheat 2020

RegisterNUICallback('PostNewTweet', function(data, cb)

    local TweetMessage = {
        firstName = PhoneData.PlayerData.charinfo.firstname,
        lastName = PhoneData.PlayerData.charinfo.lastname,
        message = data.Message,
        url = data.Foto,
        time = data.Date,
        id =  PhoneData.id,
        picture = data.Picture
    }
	if not data.Foto then 
	   TweetMessage.url = ""
	end
    test = ""
    TriggerServerEvent("s4-phone:saveTwitterToDatabase", TweetMessage.firstName, TweetMessage.lastName, TweetMessage.message, TweetMessage.url, TweetMessage.time, TweetMessage.picture)
   TriggerServerEvent("s4-phone:server:updateidForEveryone")
    local TwitterMessage = data.Message
    local MentionTag = TwitterMessage:split("@")
    local Hashtag = TwitterMessage:split("#")

    for i = 2, #Hashtag, 1 do
        local Handle = Hashtag[i]:split(" ")[1]
        if Handle ~= nil or Handle ~= "" then
            local InvalidSymbol = string.match(Handle, patt)
            if InvalidSymbol then
                Handle = Handle:gsub("%"..InvalidSymbol, "")
            end
            TriggerServerEvent('s4-phone:server:UpdateHashtags', Handle, TweetMessage)
        end
    end

    for i = 2, #MentionTag, 1 do
        local Handle = MentionTag[i]:split(" ")[1]
        if Handle ~= nil or Handle ~= "" then
            local Fullname = Handle:split("_")
            local Firstname = Fullname[1]
            table.remove(Fullname, 1)
            local Lastname = table.concat(Fullname, " ")

            if (Firstname ~= nil and Firstname ~= "") and (Lastname ~= nil and Lastname ~= "") then
                if Firstname ~= PhoneData.PlayerData.charinfo.firstname and Lastname ~= PhoneData.PlayerData.charinfo.lastname then
                    TriggerServerEvent('s4-phone:server:MentionedPlayer', Firstname, Lastname, TweetMessage)
                else
                    SetTimeout(2500, function()
                        SendNUIMessage({
                            action = "PhoneNotification",
                            PhoneNotify = {
                                title = Lang("TWITTER_TITLE"),
                                text = Lang("MENTION_YOURSELF"),
                                icon = "fab fa-twitter",
                                color = "#1DA1F2",
                            },
                        })
                    end)
                end
            end
        end
    end
    Citizen.Wait(1000)


    table.insert(PhoneData.Tweets, TweetMessage)
    table.insert(PhoneData.SelfTweets, TweetMessage)
    TriggerServerEvent('s4-phone:server:updateForEveryone', PhoneData.Tweets)
    cb(PhoneData.Tweets)
    TriggerServerEvent('s4-phone:server:UpdateTweets', TweetMessage)
    SendNUIMessage({
        action= "updateTest",
        selftTweets= PhoneData.SelfTweets
    })
end)

local takePhoto = false
RegisterNUICallback('PostNewImage', function(data, cb)

    SetNuiFocus(false, false)
    SetNuiFocusKeepInput(false)
    CreateMobilePhone(1)
    CellCamActivate(true, true)
    takePhoto = true



while takePhoto do
    Citizen.Wait(0)

    if IsControlJustPressed(1, 27) then -- Toogle Mode
        frontCam = not frontCam
        CellFrontCamActivate(frontCam)

    else if IsControlJustPressed(1, 176) then
     exports['screenshot-basic']:requestScreenshotUpload('https://discord.com/api/webhooks/839844465241358388/Hr2Ylj4dJmq6PopDq06CshMoT2H0bzpr0z0CYOU5jpE-r95hXCGdTtawt4bHRa0yHv8F', 'files[]', function(data2)
        DestroyMobilePhone()
        CellCamActivate(false, false)
		Wait(1000)
        local resp = json.decode(data2)
		
        test = resp.attachments[1].proxy_url
        cb(resp.attachments[1].proxy_url)
    end)
	 Wait(1000)
     DestroyMobilePhone()
     takePhoto = false
    end
    end
    end
    OpenPhone(old_tel ,old_parmak, old_durum)

end)



RegisterNetEvent('qb-phone:client:TransferMoney')
AddEventHandler('qb-phone:client:TransferMoney', function(amount, newmoney)
    PhoneData.PlayerData.money.bank = newmoney
        SendNUIMessage({ action = "PhoneNotification", PhoneNotify = { title = "QBank", text = "&#36;"..amount.." has been added to your account!", icon = "fas fa-university", color = "#8c7ae6", }, })
        SendNUIMessage({ action = "UpdateBank", NewBalance = PhoneData.PlayerData.money.bank })
end)

RegisterNetEvent('s4-phone:client:UpdateTweets')
AddEventHandler('s4-phone:client:UpdateTweets', function(src, NewTweetData)

    if not PhoneData.isOpen then
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang("") .. " @"..NewTweetData.firstName.." "..NewTweetData.lastName.."",
                content = NewTweetData.message,
                icon = "fab fa-twitter",
                timeout = 3500,
                color = "#2E6FC7",
            },
        })
    else
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("") .. " @"..NewTweetData.firstName.." "..NewTweetData.lastName.."",
                text = NewTweetData.message,
                icon = "fab fa-twitter",
                color = "#2E6FC7",
            },
        })
    end

end)

RegisterNUICallback('GetMentionedTweets', function(data, cb)
    cb(PhoneData.MentionedTweets)
end)

RegisterNUICallback('GetHashtags', function(data, cb)
    if PhoneData.Hashtags ~= nil and next(PhoneData.Hashtags) ~= nil then
        cb(PhoneData.Hashtags)
    else
        cb(nil)
    end
end)

RegisterNetEvent('s4-phone:client:GetMentioned')
AddEventHandler('s4-phone:client:GetMentioned', function(TweetMessage, AppAlerts)
    Config.PhoneApplications["twitter"].Alerts = AppAlerts
    if not PhoneData.isOpen then
        SendNUIMessage({ action = "Notification", NotifyData = { title = Lang("TWITTER_GETMENTIONED"), content = TweetMessage.message, icon = "fab fa-twitter", timeout = 3500, color = nil, }, })
    else
        SendNUIMessage({ action = "PhoneNotification", PhoneNotify = { title = Lang("TWITTER_GETMENTIONED"), text = TweetMessage.message, icon = "fab fa-twitter", color = "#1DA1F2", }, })
    end
    local TweetMessage = {firstName = TweetMessage.firstName, lastName = TweetMessage.lastName, message = TweetMessage.message, time = TweetMessage.time, picture = TweetMessage.picture}
    table.insert(PhoneData.MentionedTweets, TweetMessage)
    SendNUIMessage({ action = "RefreshAppAlerts", AppData = Config.PhoneApplications })
    SendNUIMessage({ action = "UpdateMentionedTweets", Tweets = PhoneData.MentionedTweets })
end)

RegisterNUICallback('ClearMentions', function()
    Config.PhoneApplications["twitter"].Alerts = 0
    SendNUIMessage({
        action = "RefreshAppAlerts",
        AppData = Config.PhoneApplications
    })
    TriggerServerEvent('s4-phone:server:SetPhoneAlerts', "twitter", 0)
    SendNUIMessage({ action = "RefreshAppAlerts", AppData = Config.PhoneApplications })
end)

RegisterNUICallback('ClearGeneralAlerts', function(data)
    SetTimeout(400, function()
        Config.PhoneApplications[data.app].Alerts = 0
        SendNUIMessage({
            action = "RefreshAppAlerts",
            AppData = Config.PhoneApplications
        })
        TriggerServerEvent('s4-phone:server:SetPhoneAlerts', data.app, 0)
        SendNUIMessage({ action = "RefreshAppAlerts", AppData = Config.PhoneApplications })
    end)
end)

function string:split(delimiter)
    local result = { }
    local from  = 1
    local delim_from, delim_to = string.find( self, delimiter, from  )
    while delim_from do
      table.insert( result, string.sub( self, from , delim_from-1 ) )
      from  = delim_to + 1
      delim_from, delim_to = string.find( self, delimiter, from  )
    end
    table.insert( result, string.sub( self, from  ) )
    return result
end

RegisterNUICallback('TransferMoney', function(data, cb)
    data.amount = tonumber(data.amount)
    if tonumber(PhoneData.PlayerData.money.bank) >= data.amount then
        local amaountata = PhoneData.PlayerData.money.bank - data.amount
        TriggerServerEvent('s4-phone:server:TransferMoney', data.iban, data.amount)
        local cbdata = {
            CanTransfer = true,
            NewAmount = amaountata 
        }
        cb(cbdata)
    else
        local cbdata = {
            CanTransfer = false,
            NewAmount = nil,
        }
        cb(cbdata)
    end
end)

RegisterNUICallback('GetWhatsappChats', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetContactPictures', function(Chats)
        cb(Chats)
    end, PhoneData.Chats)
end)

RegisterNUICallback('CallContact', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetCallState', function(CanCall, IsOnline, IsAvailable)
        local status = {
            CanCall = CanCall,
            IsOnline = IsOnline,
            InCall = PhoneData.CallData.InCall,
            IsAvailable = IsAvailable,
            image = data.ContactData.image
        }
        cb(status)
        if CanCall and not status.InCall and (data.ContactData.number ~= PhoneData.PlayerData.charinfo.phone) and not IsAvailable then
            CallContact(data.ContactData, data.Anonymous)
        end
    end, data.ContactData)
end)

function GenerateCallId(caller, target)
    local CallId = math.ceil(((tonumber(caller) + tonumber(target)) / 100 * 1))
    return CallId
end

CallContact = function(CallData, AnonymousCall)
    local RepeatCount = 0
    PhoneData.CallData.CallType = "outgoing"
    PhoneData.CallData.InCall = true
    PhoneData.CallData.TargetData = CallData
    PhoneData.CallData.AnsweredCall = false
    PhoneData.CallData.CallId = GenerateCallId(PhoneData.PlayerData.charinfo.phone, CallData.number)

    TriggerServerEvent('s4-phone:server:CallContact', PhoneData.CallData.TargetData, PhoneData.CallData.CallId, AnonymousCall)
    TriggerServerEvent('s4-phone:server:SetCallState', true)

    for i = 1, Config.CallRepeats + 1, 1 do
        if not PhoneData.CallData.AnsweredCall then
            if RepeatCount + 1 ~= Config.CallRepeats + 1 then
                if PhoneData.CallData.InCall then
                    RepeatCount = RepeatCount + 1
                    TriggerServerEvent("InteractSound_SV:PlayOnSource", "demo", 0.1)
                else
                    break
                end
                Citizen.Wait(Config.RepeatTimeout)
            else
                CancelCall()
                break
            end
        else
            break
        end
    end
end

CancelCall = function()
    TriggerServerEvent('s4-phone:server:CancelCall', PhoneData.CallData, GetPlayerServerId(PlayerId()))
	TriggerServerEvent('s4:CancelCall', GetPlayerServerId(PlayerId()), PhoneData.CallData)
     if PhoneData.CallData.CallType == "ongoing" then
         if Config.Tokovoip then
          --  exports.tokovoip_script:removePlayerFromRadio(PhoneData.CallData.CallId)
         else
          --   exports["mumble-voip"]:SetCallChannel(0)
         end
     end
    
    PhoneData.CallData.CallType = nil
    PhoneData.CallData.InCall = false
    PhoneData.CallData.AnsweredCall = false
    PhoneData.CallData.TargetData = {}
    PhoneData.CallData.CallId = nil

    if not PhoneData.isOpen then
        StopAnimTask(PlayerPedId(), PhoneData.AnimationData.lib, PhoneData.AnimationData.anim, 2.5)
        deletePhone()
        PhoneData.AnimationData.lib = nil
        PhoneData.AnimationData.anim = nil
    else
        PhoneData.AnimationData.lib = nil
        PhoneData.AnimationData.anim = nil
    end

    TriggerServerEvent('s4-phone:server:SetCallState', false)

    if not PhoneData.isOpen then
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang("PHONE_TITLE"),
                content = Lang("PHONE_CALL_END"),
                icon = "fas fa-phone-volume",
                timeout = 3500,
                color = "#e84118",
            },
        })
    else
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("PHONE_TITLE"),
                text = Lang("PHONE_CALL_END"),
                icon = "fas fa-phone-volume",
                color = "#e84118",
            },
        })

        SendNUIMessage({
            action = "SetupHomeCall",
            CallData = PhoneData.CallData,
        })

        SendNUIMessage({
            action = "CancelOutgoingCall",
        })
    end
end

RegisterNetEvent('s4-phone:client:CancelCall')
AddEventHandler('s4-phone:client:CancelCall', function()
    if PhoneData.CallData.CallType == "ongoing" then
        SendNUIMessage({
            action = "CancelOngoingCall"
        })
         if Config.Tokovoip then
        -- exports.tokovoip_script:removePlayerFromRadio(PhoneData.CallData.CallId)
         else
        --     exports["mumble-voip"]:SetCallChannel(0)
         end
    end
    PhoneData.CallData.CallType = nil
    PhoneData.CallData.InCall = false
    PhoneData.CallData.AnsweredCall = false
    PhoneData.CallData.TargetData = {}

    if not PhoneData.isOpen then
        StopAnimTask(PlayerPedId(), PhoneData.AnimationData.lib, PhoneData.AnimationData.anim, 2.5)
        deletePhone()
        PhoneData.AnimationData.lib = nil
        PhoneData.AnimationData.anim = nil
    else
        PhoneData.AnimationData.lib = nil
        PhoneData.AnimationData.anim = nil
    end

    TriggerServerEvent('s4-phone:server:SetCallState', false)

    if not PhoneData.isOpen then
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang("PHONE_TITLE"),
                content = Lang("PHONE_CALL_END"),
                icon = "fas fa-phone-volume",
                timeout = 3500,
                color = "#e84118",
            },
        })
    else
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("PHONE_TITLE"),
                text = Lang("PHONE_CALL_END"),
                icon = "fas fa-phone-volume",
                color = "#e84118",
            },
        })

        SendNUIMessage({
            action = "SetupHomeCall",
            CallData = PhoneData.CallData,
        })

        SendNUIMessage({
            action = "CancelOutgoingCall",
        })
    end
end)

RegisterNetEvent('s4-phone:client:GetCalled')
AddEventHandler('s4-phone:client:GetCalled', function(CallerNumber, CallId, AnonymousCall)
    local RepeatCount = 0
    local CallData = {
        number = CallerNumber,
        name = IsNumberInContacts(CallerNumber),
        anonymous = AnonymousCall
    }

    if AnonymousCall then
        CallData.name = "Gizli Numara"
    end

    PhoneData.CallData.CallType = "incoming"
    PhoneData.CallData.InCall = true
    PhoneData.CallData.AnsweredCall = false
    PhoneData.CallData.TargetData = CallData
    PhoneData.CallData.CallId = CallId

    TriggerServerEvent('s4-phone:server:SetCallState', true)

    SendNUIMessage({
        action = "SetupHomeCall",
        CallData = PhoneData.CallData,
    })

    for i = 1, Config.CallRepeats + 1, 1 do
        if not PhoneData.CallData.AnsweredCall then
            if RepeatCount + 1 ~= Config.CallRepeats + 1 then
                if PhoneData.CallData.InCall then
                    RepeatCount = RepeatCount + 1
                    if PhoneData.Sounds then
                        TriggerServerEvent("InteractSound_SV:PlayOnSource", "ringing", 0.2)
                    end

                    if not PhoneData.isOpen then
                        SendNUIMessage({
                            action = "IncomingCallAlert",
                            CallData = PhoneData.CallData.TargetData,
                            Canceled = false,
                            AnonymousCall = AnonymousCall,
                        })
                    end
                else
                    SendNUIMessage({
                        action = "IncomingCallAlert",
                        CallData = PhoneData.CallData.TargetData,
                        Canceled = true,
                        AnonymousCall = AnonymousCall,
                    })
                    TriggerServerEvent('s4-phone:server:AddRecentCall', "missed", CallData)
                    break
                end
                Citizen.Wait(Config.RepeatTimeout)
            else
                SendNUIMessage({
                    action = "IncomingCallAlert",
                    CallData = PhoneData.CallData.TargetData,
                    Canceled = true,
                    AnonymousCall = AnonymousCall,
                })
                TriggerServerEvent('s4-phone:server:AddRecentCall', "missed", CallData)
                break
            end
        else
            TriggerServerEvent('s4-phone:server:AddRecentCall', "missed", CallData)
            break
        end
    end
end)

RegisterNUICallback('CancelOutgoingCall', function()
    CancelCall()
end)



RegisterNUICallback('RehberVeriEkle', function(data)
    
end)

RegisterNUICallback('DenyIncomingCall', function()
    CancelCall()
end)

RegisterNUICallback('CancelOngoingCall', function()
    CancelCall()
end)

RegisterNUICallback('AnswerCall', function()
    AnswerCall()
end)

function AnswerCall()
    if (PhoneData.CallData.CallType == "incoming" or PhoneData.CallData.CallType == "outgoing") and PhoneData.CallData.InCall and not PhoneData.CallData.AnsweredCall then
        PhoneData.CallData.CallType = "ongoing"
        PhoneData.CallData.AnsweredCall = true
        PhoneData.CallData.CallTime = 0

        SendNUIMessage({ action = "AnswerCall", CallData = PhoneData.CallData})
        SendNUIMessage({ action = "SetupHomeCall", CallData = PhoneData.CallData})

        TriggerServerEvent('s4-phone:server:SetCallState', true)

        if PhoneData.isOpen then
            DoPhoneAnimation('cellphone_text_to_call')
        else
            DoPhoneAnimation('cellphone_call_listen_base')
        end

        Citizen.CreateThread(function()
            while true do
                if PhoneData.CallData.AnsweredCall then
                    PhoneData.CallData.CallTime = PhoneData.CallData.CallTime + 1
                    SendNUIMessage({
                        action = "UpdateCallTime",
                        Time = PhoneData.CallData.CallTime,
                        Name = PhoneData.CallData.TargetData.name,
                    })
                else
                    break
                end
				


                Citizen.Wait(1000)
            end
			
		
        end)

        TriggerServerEvent('s4-phone:server:AnswerCall', PhoneData.CallData, GetPlayerServerId(PlayerId()))
		TriggerServerEvent('s4:AnswerCall', GetPlayerServerId(PlayerId()), PhoneData.CallData)
         if Config.Tokovoip then
          --       exports.tokovoip_script:addPlayerToRadio(PhoneData.CallData.CallId, 'Phone')
         else
          --   exports["mumble-voip"]:SetCallChannel(PhoneData.CallData+1)
         end
    else
        PhoneData.CallData.InCall = false
        PhoneData.CallData.CallType = nil
        PhoneData.CallData.AnsweredCall = false

        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("PHONE_TITLE"),
                text = Lang("PHONE_NOINCOMING"),
                icon = "fas fa-phone-volume",
                color = "#e84118",
            },
        })
    end
end

RegisterNetEvent('s4-phone:client:AnswerCall')
AddEventHandler('s4-phone:client:AnswerCall', function()
    if (PhoneData.CallData.CallType == "incoming" or PhoneData.CallData.CallType == "outgoing") and PhoneData.CallData.InCall and not PhoneData.CallData.AnsweredCall then
        PhoneData.CallData.CallType = "ongoing"
        PhoneData.CallData.AnsweredCall = true
        PhoneData.CallData.CallTime = 0

        SendNUIMessage({ action = "AnswerCall", CallData = PhoneData.CallData})
        SendNUIMessage({ action = "SetupHomeCall", CallData = PhoneData.CallData})

        TriggerServerEvent('s4-phone:server:SetCallState', true)

        if PhoneData.isOpen then
            DoPhoneAnimation('cellphone_text_to_call')
        else
            DoPhoneAnimation('cellphone_call_listen_base')
        end

        Citizen.CreateThread(function()
            while true do
                if PhoneData.CallData.AnsweredCall then
                    PhoneData.CallData.CallTime = PhoneData.CallData.CallTime + 1
                    SendNUIMessage({
                        action = "UpdateCallTime",
                        Time = PhoneData.CallData.CallTime,
                        Name = PhoneData.CallData.TargetData.name,
                    })
                else
                    break
                end

                Citizen.Wait(1000)
            end
        end)

         if Config.Tokovoip then
           --  exports.tokovoip_script:addPlayerToRadio(PhoneData.CallData.CallId, 'Phone')
         else
           --  exports["mumble-voip"]:SetCallChannel(PhoneData.CallData+1)
         end
    else
        PhoneData.CallData.InCall = false
        PhoneData.CallData.CallType = nil
        PhoneData.CallData.AnsweredCall = false

        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("PHONE_TITLE"),
                text = Lang("PHONE_NOINCOMING"),
                icon = "fas fa-phone-volume",
                color = "#e84118",
            },
        })
    end
end)

AddEventHandler('onResourceStop', function(resource)
     if resource == GetCurrentResourceName() then
        SetNuiFocus(false, false)
        SetNuiFocusKeepInput(false)
     end
end)

RegisterNUICallback('FetchSearchResults', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:FetchResult', function(result)
        cb(result)
    end, data.input)
end)

RegisterNUICallback('FetchVehicleResults', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetVehicleSearchResults', function(result)
        if result ~= nil then
            for k, v in pairs(result) do
                result[k].isFlagged = false
            end
        end
        cb(result)
    end, data.input)
end)

RegisterNUICallback('FetchVehicleScan', function(data, cb)
    local vehicle = QBCore.Functions.GetClosestVehicle()
    local plate = GetVehicleNumberPlateText(vehicle)
    local model = GetEntityModel(vehicle)

    QBCore.Functions.TriggerCallback('s4-phone:server:ScanPlate', function(result)
        result.isFlagged = false
        result.label = model
        cb(result)
    end, plate)
end)

RegisterNetEvent('s4-phone:client:addPoliceAlert')
AddEventHandler('s4-phone:client:addPoliceAlert', function(alertData)
    if PlayerJob.name == 'police' then
        SendNUIMessage({
            action = "AddPoliceAlert",
            alert = alertData,
        })
    end
end)

RegisterNUICallback('SetAlertWaypoint', function(data)
    local coords = data.alert.coords

    TriggerEvent('notification', Lang("GPS_SET") .. data.alert.title)
    SetNewWaypoint(coords.x, coords.y)
end)

RegisterNUICallback('RemoveSuggestion', function(data, cb)
    local data = data.data

    if PhoneData.SuggestedContacts ~= nil and next(PhoneData.SuggestedContacts) ~= nil then
        for k, v in pairs(PhoneData.SuggestedContacts) do
            if (data.name[1] == v.name[1] and data.name[2] == v.name[2]) and data.number == v.number and data.bank == v.bank then
                table.remove(PhoneData.SuggestedContacts, k)
            end
        end
    end
end)

local lastServerId = nil
RegisterNetEvent('s4-phone:client:GiveContactDetails')
AddEventHandler('s4-phone:client:GiveContactDetails', function()
    local ped = PlayerPedId()

    local player, distance = QBCore.Functions.GetClosestPlayer()
    if player ~= -1 and distance < 2.5 then
        local PlayerId = GetPlayerServerId(player)
        if lastServerId ~= PlayerId then
            lastServerId = PlayerId
            TriggerServerEvent('s4-phone:server:GiveContactDetails', PlayerId)
        else
            exports.mythic_notify:SendAlert('error', 'You have already given this person their contact information.')
        end
    else
        exports.mythic_notify:SendAlert('error', 'There is no one near.')
    end
end)

RegisterNUICallback('DeleteContact', function(data, cb)
    local Name = data.CurrentContactName
    local Number = data.CurrentContactNumber
    local Account = data.CurrentContactIban

    for k, v in pairs(PhoneData.Contacts) do
        if v.name == Name and v.number == Number then
            table.remove(PhoneData.Contacts, k)
            if PhoneData.isOpen then
                SendNUIMessage({
                    action = "PhoneNotification",
                    PhoneNotify = {
                        title = Lang("PHONE_TITLE"),
                        text = Lang("CONTACTS_REMOVED"),
                        icon = "fas fa-phone-volume",
                        color = "#04b543",
                        timeout = 1500,
                    },
                })
            else
                SendNUIMessage({
                    action = "Notification",
                    NotifyData = {
                        title = Lang("PHONE_TITLE"),
                        content = Lang("CONTACTS_REMOVED"),
                        icon = "fas fa-phone-volume",
                        timeout = 3500,
                        color = "#04b543",
                    },
                })
            end
            break
        end
    end
    Citizen.Wait(100)
    cb(PhoneData.Contacts)
    if PhoneData.Chats[Number] ~= nil and next(PhoneData.Chats[Number]) ~= nil then
        PhoneData.Chats[Number].name = Number
    end
    TriggerServerEvent('s4-phone:server:RemoveContact', Name, Number)
end)

RegisterNetEvent('s4-phone:client:AddNewSuggestion')
AddEventHandler('s4-phone:client:AddNewSuggestion', function(SuggestionData)
    table.insert(PhoneData.SuggestedContacts, SuggestionData)

    if PhoneData.isOpen then
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("PHONE_TITLE"),
                text = Lang("CONTACTS_NEWSUGGESTED"),
                icon = "fa fa-phone-alt",
                color = "#04b543",
                timeout = 1500,
            },
        })
    else
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang("PHONE_TITLE"),
                content = Lang("CONTACTS_NEWSUGGESTED"),
                icon = "fa fa-phone-alt",
                timeout = 3500,
                color = "#04b543",
            },
        })
    end

    Config.PhoneApplications["phone"].Alerts = Config.PhoneApplications["phone"].Alerts + 1
    TriggerServerEvent('s4-phone:server:SetPhoneAlerts', "phone", Config.PhoneApplications["phone"].Alerts)
end)

RegisterNUICallback('GetCryptoData', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-crypto:server:GetCryptoData', function(CryptoData)
        cb(CryptoData)
    end, data.crypto)
end)

RegisterNUICallback('BuyCrypto', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-crypto:server:BuyCrypto', function(CryptoData)
        cb(CryptoData)
    end, data)
end)

RegisterNUICallback('SellCrypto', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-crypto:server:SellCrypto', function(CryptoData)
        cb(CryptoData)
    end, data)
end)

RegisterNUICallback('TransferCrypto', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-crypto:server:TransferCrypto', function(CryptoData)
        cb(CryptoData)
    end, data)
end)

RegisterNetEvent('s4-phone:client:RemoveBankMoney')
AddEventHandler('s4-phone:client:RemoveBankMoney', function(amount)
    if PhoneData.isOpen then
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("BANK_TITLE"),
                text = "There is Γé¼"..amount.." withdraw from your bank!",
                icon = "fas fa-university",
                color = "#ff002f",
                timeout = 3500,
            },
        })
    else
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang("BANK_TITLE"),
                content = "There is Γé¼"..amount.." withdraw from your bank!",
                icon = "fas fa-university",
                timeout = 3500,
                color = "#ff002f",
            },
        })
    end
end)

RegisterNetEvent('s4-phone:client:AddTransaction')
AddEventHandler('s4-phone:client:AddTransaction', function(SenderData, TransactionData, Message, Title)
    local Data = {
        TransactionTitle = Title,
        TransactionMessage = Message,
    }

    table.insert(PhoneData.CryptoTransactions, Data)

    if PhoneData.isOpen then
        SendNUIMessage({
            action = "PhoneNotification",
            PhoneNotify = {
                title = Lang("CRYPTO_TITLE"),
                text = Message,
                icon = "fas fa-chart-pie",
                color = "#04b543",
                timeout = 1500,
            },
        })
    else
        SendNUIMessage({
            action = "Notification",
            NotifyData = {
                title = Lang("CRYPTO_TITLE"),
                content = Message,
                icon = "fas fa-chart-pie",
                timeout = 3500,
                color = "#04b543",
            },
        })
    end

    SendNUIMessage({
        action = "UpdateTransactions",
        CryptoTransactions = PhoneData.CryptoTransactions
    })

    TriggerServerEvent('s4-phone:server:AddTransaction', Data)
end)

RegisterNUICallback('GetCryptoTransactions', function(data, cb)
    local Data = {
        CryptoTransactions = PhoneData.CryptoTransactions
    }
    cb(Data)
end)

RegisterNUICallback('GetAvailableRaces', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-lapraces:server:GetRaces', function(Races)
        cb(Races)
    end)
end)

RegisterNUICallback('JoinRace', function(data)
    TriggerServerEvent('qb-lapraces:server:JoinRace', data.RaceData)
end)

RegisterNUICallback('LeaveRace', function(data)
    TriggerServerEvent('qb-lapraces:server:LeaveRace', data.RaceData)
end)

RegisterNUICallback('StartRace', function(data)
    TriggerServerEvent('qb-lapraces:server:StartRace', data.RaceData.RaceId)
end)

RegisterNetEvent('s4-phone:client:UpdateLapraces')
AddEventHandler('s4-phone:client:UpdateLapraces', function()
    SendNUIMessage({
        action = "UpdateRacingApp",
    })
end)

RegisterNUICallback('GetRaces', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-lapraces:server:GetListedRaces', function(Races)
        cb(Races)
    end)
end)

RegisterNUICallback('GetTrackData', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-lapraces:server:GetTrackData', function(TrackData, CreatorData)
        TrackData.CreatorData = CreatorData
        cb(TrackData)
    end, data.RaceId)
end)

RegisterNUICallback('SetupRace', function(data, cb)
    TriggerServerEvent('qb-lapraces:server:SetupRace', data.RaceId, tonumber(data.AmountOfLaps))
end)

RegisterNUICallback('HasCreatedRace', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-lapraces:server:HasCreatedRace', function(HasCreated)
        cb(HasCreated)
    end)
end)

RegisterNUICallback('IsInRace', function(data, cb)
    local InRace = exports['qb-lapraces']:IsInRace()
    cb(InRace)
end)

RegisterNUICallback('IsAuthorizedToCreateRaces', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-lapraces:server:IsAuthorizedToCreateRaces', function(NameAvailable)
        local data = {
            IsAuthorized = true,
            IsBusy = exports['qb-lapraces']:IsInEditor(),
            IsNameAvailable = NameAvailable,
        }
        cb(data)
    end, data.TrackName)
end)

RegisterNUICallback('StartTrackEditor', function(data, cb)
    TriggerServerEvent('qb-lapraces:server:CreateLapRace', data.TrackName)
end)

RegisterNUICallback('GetRacingLeaderboards', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-lapraces:server:GetRacingLeaderboards', function(Races)
        cb(Races)
    end)
end)

RegisterNUICallback('RaceDistanceCheck', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-lapraces:server:GetRacingData', function(RaceData)
        local ped = PlayerPedId()
        local coords = GetEntityCoords(ped)
        local checkpointcoords = RaceData.Checkpoints[1].coords
        local dist = GetDistanceBetweenCoords(coords, checkpointcoords.x, checkpointcoords.y, checkpointcoords.z, true)
        if dist <= 115.0 then
            if data.Joined then
                TriggerEvent('qb-lapraces:client:WaitingDistanceCheck')
            end
            cb(true)
        else
            TriggerEvent('notification', 'You are too far from the race. Your navigation is set to the race.', 2)
            SetNewWaypoint(checkpointcoords.x, checkpointcoords.y)
            cb(false)
        end
    end, data.RaceId)
end)

RegisterNUICallback('IsBusyCheck', function(data, cb)
    if data.check == "editor" then
        cb(exports['qb-lapraces']:IsInEditor())
    else
        cb(exports['qb-lapraces']:IsInRace())
    end
end)

RegisterNUICallback('CanRaceSetup', function(data, cb)
    QBCore.Functions.TriggerCallback('qb-lapraces:server:CanRaceSetup', function(CanSetup)
        cb(CanSetup)
    end)
end)

RegisterNUICallback('GetPlayerHouses', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetPlayerHouses', function(Houses)
        cb(Houses)
    end)
end)

RegisterNUICallback('RemoveKeyholder', function(data)
    TriggerServerEvent('qb-houses:server:removeHouseKey', data.HouseData.name, {
        identifier = data.HolderData.identifier,
        firstname = data.HolderData.charinfo.firstname,
        lastname = data.HolderData.charinfo.lastname,
    })
end)

RegisterNUICallback('FetchPlayerHouses', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:MeosGetPlayerHouses', function(result)
        cb(result)
    end, data.input)
end)

RegisterNUICallback('SetGPSLocation', function(data, cb)
    local ped = PlayerPedId()

    SetNewWaypoint(data.coords.x, data.coords.y)
    TriggerEvent('notification', 'GPS is set!')
end)

RegisterNUICallback('SetApartmentLocation', function(data, cb)
    local ApartmentData = data.data.appartmentdata
    local TypeData = Apartments.Locations[ApartmentData.type]

    SetNewWaypoint(TypeData.coords.enter.x, TypeData.coords.enter.y)
    TriggerEvent('notification', 'GPS is set!')
end)

RegisterNUICallback('GetCurrentLawyers', function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetCurrentLawyers', function(lawyers)
        cb(lawyers)
    end)
end)

RegisterNUICallback('GetCurrentpolices', function(data, cb)
    
    QBCore.Functions.TriggerCallback('s4-phone:server:GetCurrentpolices', function(lawyers)
        cb(lawyers)
    end)
end)

RegisterNUICallback("GetCurrentDrivers", function(data, cb)
    
end)

RegisterNUICallback("GetCurrentMecano", function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetCurrentMecano', function(drivers)
        cb(drivers)
    end)
end)

RegisterNUICallback("GetCurrentDoctor", function(data, cb)
    QBCore.Functions.TriggerCallback('s4-phone:server:GetCurrentDoctor', function(drivers)
        cb(drivers)
    end)
end)


Lang = function(item)
    local lang = Config.Languages[Config.Language]

    if lang and lang[item] then
        return lang[item]
    end

    return item
end

RegisterNUICallback('GetLangData', function(data, cb)
    cb({ table = Config.Languages, current = Config.Language })
end)

RegisterNetEvent('s4-phone:client:anon')
AddEventHandler('s4-phone:client:anon',function(msj)
    if msj == nil or msj == '' then return end
    local TweetMessage = {
        firstName = 'Anonim',
        lastName = '',
        message = msj,
        url = test or "",
        time = 'none',
        id =  PhoneData.id,
        picture = 'https://cdn.discordapp.com/attachments/808603408302473216/831682724431527963/unknown.png'
    }
    test = ""
    TriggerServerEvent("s4-phone:saveTwitterToDatabase", TweetMessage.firstName, TweetMessage.lastName, TweetMessage.message, TweetMessage.url, TweetMessage.time, TweetMessage.picture)
   TriggerServerEvent("s4-phone:server:updateidForEveryone")
    local TwitterMessage = msj
    local MentionTag = TwitterMessage:split("@")
    local Hashtag = TwitterMessage:split("#")

    for i = 2, #Hashtag, 1 do
        local Handle = Hashtag[i]:split(" ")[1]
        if Handle ~= nil or Handle ~= "" then
            local InvalidSymbol = string.match(Handle, patt)
            if InvalidSymbol then
                Handle = Handle:gsub("%"..InvalidSymbol, "")
            end
            TriggerServerEvent('s4-phone:server:UpdateHashtags', Handle, TweetMessage)
        end
    end

    for i = 2, #MentionTag, 1 do
        local Handle = MentionTag[i]:split(" ")[1]
        if Handle ~= nil or Handle ~= "" then
            local Fullname = Handle:split("_")
            local Firstname = Fullname[1]
            table.remove(Fullname, 1)
            local Lastname = table.concat(Fullname, " ")

            if (Firstname ~= nil and Firstname ~= "") and (Lastname ~= nil and Lastname ~= "") then
                if Firstname ~= PhoneData.PlayerData.charinfo.firstname and Lastname ~= PhoneData.PlayerData.charinfo.lastname then
                    TriggerServerEvent('s4-phone:server:MentionedPlayer', Firstname, Lastname, TweetMessage)
                else
                    SetTimeout(2500, function()
                        SendNUIMessage({
                            action = "PhoneNotification",
                            PhoneNotify = {
                                title = Lang("TWITTER_TITLE"),
                                text = Lang("MENTION_YOURSELF"),
                                icon = "fab fa-twitter",
                                color = "#1DA1F2",
                            },
                        })
                    end)
                end
            end
        end
    end
    Citizen.Wait(1000)


    table.insert(PhoneData.Tweets, TweetMessage)
    table.insert(PhoneData.SelfTweets, TweetMessage)
    TriggerServerEvent('s4-phone:server:updateForEveryone', PhoneData.Tweets)
    TriggerServerEvent('s4-phone:server:UpdateTweets', TweetMessage)
    SendNUIMessage({
        action= "updateTest",
        selftTweets= PhoneData.SelfTweets
    })
end)





RegisterNUICallback("GetHavaDurumu", function(data, cb)
     local simdikizaman , weatherType2 , percentWeather2= GetWeatherTypeTransition()
	 local birsonraki = GetNextWeatherTypeHashName()
	 local havadurumux = {}
     local init_hr = GetClockHours()
     local weather = Citizen.InvokeNative(0x564B884A05EC45A3)
     local init_w = getWeatherStringFromHash(weather)
     local init_m = GetClockMonth()

	 havadurumux.simdikizaman = havadurumu(simdikizaman)
	 havadurumux.birsonraki = havadurumu(birsonraki)
     temp = calcTemp( init_w, init_m, init_hr )
     havadurumux.derece = FtoC(temp)
	 cb(havadurumux)
end)

 

function havadurumu(simdikizaman) 
	 if GetHashKey("THUNDER") == simdikizaman then simdikizaman = "THUNDER" 
	 elseif GetHashKey("RAIN") == simdikizaman then simdikizaman = "RAIN" 
	 elseif GetHashKey("EXTRASUNNY") == simdikizaman then simdikizaman = "EXTRASUNNY" 
	 elseif GetHashKey("CLOUDS") == simdikizaman then simdikizaman = "CLOUDS" 
	 elseif GetHashKey("OVERCAST") == simdikizaman then simdikizaman = "OVERCAST" 
	 elseif GetHashKey("CLEAR") == simdikizaman then simdikizaman = "CLEARING" 
	 elseif GetHashKey("CLEARING") == simdikizaman then simdikizaman = "CLEARING" 
	 elseif GetHashKey("SMOG") == simdikizaman then simdikizaman = "SMOG" 
	 elseif GetHashKey("FOGGY") == simdikizaman then simdikizaman = "FOGGY" 
	 elseif GetHashKey("XMAS") == simdikizaman then simdikizaman = "XMAS" 
	 elseif GetHashKey("SNOWLIGHT") == simdikizaman then simdikizaman = "SNOWLIGHT" 
	 elseif GetHashKey("BLIZZARD") == simdikizaman then simdikizaman = "BLIZZARD" 
	 else simdikizaman = "BILINMIYOR" end 
     return simdikizaman
end 

local resmonTimer = 1000
	
RegisterNUICallback('Fener', function(data, cb)
   if data.fener == "acik" then 
      FENER = true
	  resmonTimer = 0
   else 
      FENER = false 
      resmonTimer = 1000
   end
end)


--ExecuteCommand("time 12 12");

Citizen.CreateThread(function()
    
	while true do
      
	  if PhoneData.isOpen  then
		if FENER == true then 
		    local coords = GetEntityCoords(PlayerPedId() , true)
		    local forawrd = GetEntityForwardVector(PlayerPedId())
		    DrawSpotLight(coords.x, coords.y, coords.z, forawrd.x, forawrd.y, forawrd.z, 255, 255, 255, 20.0, 1.0, 1.0, 25.0, 0)
		    end
		  end
		  	Citizen.Wait(resmonTimer)
	end	

end)	


--- Temporator code owner
--- https://github.com/HaxersAlwaysWin/FiveM-Temporator/blob/master/client.lua

MAX_INCREASE = 1.5 -- Maximum increase in temperature between time changes
MIN_INCREASE = 0.2 -- Minimum increase in temperature between time changes
RAND_FLUC = 0.2 -- How much the temperature will fluctuate when equal to the Min or Max temperature
START_INCREASE_HR = 4 -- When the temperature will start increasing based on the time of day (4 am is default)
STOP_INCREASE_HR = 16 -- When the temperature will stop increasing based on the time of day (4 pm is default)

MonthData = {
	{36, 20}, -- January
	{41, 24}, -- February
	{53, 34}, -- March
	{65, 43}, -- April
	{75, 54}, -- May
	{82, 61}, -- June
	{86, 66}, -- July
	{85, 64}, -- August
	{78, 58}, -- September
	{66, 46}, -- October
	{53, 37}, -- November
	{43, 28}, -- December
}


AvailableWeatherTypes = {
    'EXTRASUNNY', 
    'CLEAR', 
    'NEUTRAL', 
    'SMOG', 
    'FOGGY', 
    'OVERCAST', 
    'CLOUDS', 
    'CLEARING', 
    'RAIN', 
    'THUNDER', 
    'SNOW', 
    'BLIZZARD', 
    'SNOWLIGHT', 
    'XMAS', 
    'HALLOWEEN',
}

function calcTemp( weth, mth, hr )
	local Max = MonthData[mth][1]
	local Min = MonthData[mth][2]
	local AbsMax
	local AbsMin
	local curTemp
	
	if weth == 'SNOW' or weth == 'BLIZZARD' or weth == 'SNOWLIGHT' or weth == 'XMAS' then
		AbsMax = 32  
		AbsMin = -20
	elseif weth == 'EXTRASUNNY' then
		AbsMax = Max + 20
		AbsMin = Min + 20
	elseif weth == 'SMOG' then
		AbsMax = Max + 10
		AbsMin = Min + 10
	elseif weth == 'FOGGY' or weth == 'CLOUDS' or weth == 'THUNDER' or weth == 'HALLOWEEN' then
		AbsMax = Max - 10
		AbsMin = Min - 10
	else
		AbsMax = Max
		AbsMin = Min
	end
	
	curTemp = randf(AbsMin, AbsMax)
	
	if (hr >= START_INCREASE_HR and hr < STOP_INCREASE_HR) then
		if curTemp >= AbsMax then
			curTemp = AbsMax + randf(-RAND_FLUC, RAND_FLUC)
		else
			curTemp = curTemp + randf(MIN_INCREASE, MAX_INCREASE)
		end
	else
		if curTemp <= AbsMin then
			curTemp = AbsMin + randf(-RAND_FLUC, RAND_FLUC)
		else
			curTemp = curTemp - randf(MIN_INCREASE, MAX_INCREASE)
		end
	end
	return curTemp
end


function getWeatherStringFromHash( hash )
	local w = '?'
	for i = 1, # AvailableWeatherTypes, 1 do
		if hash == GetHashKey(AvailableWeatherTypes[i]) then
			w = AvailableWeatherTypes[i]
		end
	end
	return w
end


function genSeed()
	return (GetClockYear() + GetClockMonth() + GetClockDayOfWeek())
end

function randf(low, high)
	math.randomseed(GetClockDayOfMonth() + GetClockYear() + GetClockMonth() + GetClockHours())
    return low	 + math.random()  * (high - low);
end

local disabled = false
AddEventHandler("showHud", function(show)
	disabled = not show
end)

function FtoC( f )
	return ((f - 32) * (5 / 9))
end


 

 
