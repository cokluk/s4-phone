 
TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
ESX.RegisterServerCallback("s4-phone:getCars", function(a, b)
    local c = ESX.GetPlayerFromId(a)
    if not c then
        return
    end;
    exports.ghmattimysql:execute("SELECT plate, vehicle, stored FROM owned_vehicles WHERE owner = @cid and type = @type", {["@cid"] = c.identifier, ["@type"] = "car"}, function(d)
        local e = {} for f, g in ipairs(d) do
            table.insert(e, {["garage"] = g["stored"], ["plate"] = g["plate"], ["props"] = json.decode(g["vehicle"])})
        end;
        b(e)
    end)
end)
RegisterServerEvent("s4-phone:finish")
AddEventHandler("s4-phone:finish", function(a)
    local b = source;
    local c = ESX.GetPlayerFromId(b)
    TriggerClientEvent("esx:showNotification", b, 10 .. "$  Vale hizmeti olarak tahsil edilmiştir.")
    c.removeAccountMoney("bank", 10)
end)
RegisterServerEvent("s4-phone:valet-car-set-outside")
AddEventHandler("s4-phone:valet-car-set-outside", function(a)
    local b = source;
    local c = ESX.GetPlayerFromId(b)
    if c then
        exports.ghmattimysql:execute("UPDATE owned_vehicles SET stored = @stored WHERE plate = @plate", {["@plate"] = a, ["@stored"] = 0})
    end
end)


RegisterServerEvent("s4-phone:PlakadanBilgi")
AddEventHandler("s4-phone:PlakadanBilgi", function(plaka)
  local src = source;
  local xPlayer = ESX.GetPlayerFromId(src)
  local arac_datastore = exports.ghmattimysql:executeSync("SELECT vehicle FROM owned_vehicles WHERE owner='"..xPlayer.identifier.."' AND plate='"..plaka.."' ", {})
  TriggerClientEvent("s4-phone:AracSpawn", src, arac_datastore[1].vehicle)
  --print(arac_datastore[1].vehicle)
end)


 