Config = {}
Config.RepeatTimeout = 2000
Config.CallRepeats = 10
Config.OpenPhone = 288

Config.ek_script_kullanim = false --- EK SCRIPT KULLANARAK RESMON DÜŞÜRME İŞLEMİNE YARAR 

-- Configs
Config.Language = 'en' -- You have more translations in html.
Config.Webhook = 'https://discord.com/api/webhooks/839844465241358388/Hr2Ylj4dJmq6PopDq06CshMoT2H0bzpr0z0CYOU5jpE-r95hXCGdTtawt4bHRa0yHv8F' -- Your Webhook.
Config.Tokovoip = true -- If it is true it will use Tokovoip, if it is false it will use Mumblevoip.
Config.Meslekler = {}


Config.Meslekler.polis = 'police'
Config.Meslekler.mekanik = 'mechanic'
Config.Meslekler.doktor = 'ambulance'
Config.Meslekler.avukat = 'avukat' 

--Config.WifiPass =  "123456"
 
Config.BlackMarket_closeness =  15 -- distance
Config.BlackMarket_delivery = vector3(385.833, -238.6549, 54.70053) 

Config.BlackMarkets = {
  [1] = { 
  items = {  
  
  {  name = "bandage" , price = 10 , label = "Bandage"  },    
  {  name = "medikit" , price = 15 , label = "MedKit"  }
  
  },
  WifiPass = "1",
  coords = {  314.5319, -241.1868, 53.49304 },
  },
  
  [2] = { 
  items = {  
  
  {  name = "water" , price = 1000 , label = "Water"  },    
   
  
  },
  WifiPass = "2",
  coords = {  304.6813, -268.5626, 53.45935 },
  }
  
}


 
Config.UseESXLicense = true
Config.UseESXBilling = true

Config.Darkweb = {
    List = {    
        -- [1] = { item = 'weed_seed_x', label = 'Esrar Tohumu (Dişi)', price = 5},
        -- [2] = { item = 'weed_seed_y', label = 'Esrar Tohumu (Erkek)', price = 3},
        -- [3] = { item = 'weed_fertilizer', label = 'Gübre', price = 45},
        -- [1] = { item = 'weapon_appistol', label = 'AP Pistol', price = 35000},
        -- [2] = { item = 'weapon_machinepistol', label = 'Machine Pistol', price = 33500},
        -- [3] = { item = 'weapon_snspistol', label = 'Baretta M9', price = 27500},
        -- [4] = { item = 'weapon_microsmg', label = 'Mac-10', price = 44000},
        [1] = { item = 'advancedlockpick', label = 'Gelişmiş Maymuncuk', price = 950},
        [2] = { item = 'thermite', label = 'Termit', price = 1250},
        -- [3] = { item = '', label = 'Termit', price = 1250},

    },
    DeliveryImage = 'https://media.discordapp.net/attachments/808631350105341982/833545626942963742/unknown.png',
    DeliveryCoords = vector3(-313.64, -2781.0, 5.00032),
    DeliveryTime = 18000, -- seconds
    UsageTime = 180, -- seconds
}
Config.FoodCompany = {
    [1] = { name =  'Burgershot', setjob = 'burgershot'},
    [2] = { name =  'Hotdog', setjob = 'hotdog'}
}

Config.Languages = {
    ['en'] = {
        ["NO_VEHICLE"] = "Etrafta araç yok!",
        ["NO_ONE"] = "Etrafta kimse yok!",
        ["ALLFIELDS"] = "Tüm alanlar doldurulmalıdır!",

        ["RACE_TITLE"] = "Yarış",

        ["WHATSAPP_TITLE"] = "Whatsapp",
        ["WHATSAPP_NEW_MESSAGE"] = "Yeni mesajın var!",
        ["WHATSAPP_MESSAGE_TOYOU"] = "Neden kendine mesaj gönderiyorsun?",
        ["WHATSAPP_LOCATION_SET"] = "Konum ayarlandı!",
        ["WHATSAPP_SHARED_LOCATION"] = "Paylaşılan konum",
        ["WHATSAPP_BLANK_MSG"] = "Boş mesaj gönderemezsin!",

        ["MAIL_TITLE"] = "Mail",
        ["MAIL_NEW"] = "Bir mailiniz var: ",

        ["ADVERTISEMENT_TITLE"] = "Sarı Sayfalar",
        ["ADVERTISEMENT_NEW"] = "Sarı sayfalarda ilan var!",
        ["ADVERTISEMENT_EMPY"] = "Bir mesaj girmelisiniz!",

        ["TWITTER_TITLE"] = "Twitter",
        ["TWITTER_NEW"] = "Yeni Tweet",
        ["TWITTER_POSTED"] = "Tweet gönderildi!",
        ["TWITTER_GETMENTIONED"] = "Bir tweet ile etiketledin!",
        ["MENTION_YOURSELF"] = "Kendin hakkında konuşamazsın!",
        ["TWITTER_ENTER_MSG"] = "Bir mesaj girmelisiniz!",

        ["PHONE_DONT_HAVE"] = "Telefonun yok!",
        ["PHONE_TITLE"] = "Rehber",
        ["PHONE_CALL_END"] = "Çağrı sona erdi!",
        ["PHONE_NOINCOMING"] = "Gelen aramanız yok!",
        ["PHONE_STARTED_ANON"] = "İsimsiz bir arama başlattınız!",
        ["PHONE_BUSY"] = "Sen zaten meşgulsün!",
        ["PHONE_PERSON_TALKING"] = "Bu kişi bir başkasıyla konuşuyor!",
        ["PHONE_PERSON_UNAVAILABLE"] = "Bu kişi şuanda uygun değil!",
        ["PHONE_YOUR_NUMBER"] = "Kendini arayamazsın!",
        ["PHONE_MSG_YOURSELF"] = "Kendine mesaj atamazsın!",

        ["CONTACTS_REMOVED"] = "Kişi rehberden silindi!",
        ["CONTACTS_NEWSUGGESTED"] = "Yeni bir önerilen kişiniz var!",
        ["CONTACTS_EDIT_TITLE"] = "Kişiyi düzenle",
        ["CONTACTS_ADD_TITLE"] = "Rehber",

        ["BANK_TITLE"] = 'Bank',
        ["BANK_DONT_ENOUGH"] = 'Bankada yeterli paran yok!',
        ["BANK_NOIBAN"] = "Bu kişiyle ilişkilendirilmiş IBAN yok!",

        ["CRYPTO_TITLE"] = "Crypto",

        ["GPS_SET"] = "GPS konumu ayarlandı: ",

        ["NUI_SYSTEM"] = 'Sistem',
        ["NUI_NOT_AVAILABLE"] = 'mevcut değil!',
        ["NUI_MYPHONE"] = 'Telefon Numarası',
        ["NUI_INFO"] = 'Bilgi',

        ["SETTINGS_TITLE"] = 'Ayarlar',
        ["PROFILE_SET"] = 'Kendi profil fotoğrafın!',
        ["POFILE_DEFAULT"] = 'Profil resmi varsayılana sıfırlandı!',
        ["BACKGROUND_SET"] = 'Kendi arkaplan fotoğrafı!',

        ["RACING_TITLE"] = "Yarış",
        ["RACING_CHOSEN_TRACK"] = "Bir parça seçmediniz.",
        ["RACING_ALREADY_ACTIVE"] = "Zaten aktif bir yarışınız var.",
        ["RACING_ENTER_ROUNDS"] = "Tur sayısı giriniz.",
        ["RACING_CANT_THIS_TIME"] = "Şuanda yarış yapılamaz.",
        ["RACING_ALREADY_STARTED"] = "Yarış çoktan başladı.",
        ["RACING_ALREADY_INRACE"] = "Zaten bir yarış içerisindesin.",
        ["RACING_ALREADY_CREATED"] = "Zaten bir parça oluşturuyorsunuz.",
        ["RACING_INEDITOR"] = "Bir editördesin.",
        ["RACING_INRACE"] = "Bir yarıştasın.",
        ["RACING_CANTSTART"] = "Yarış pisti oluşturma hakkınız yok.",
        ["RACING_CANTTHISNAME"] = "Bu isim uygun değil.",
        ["RACING_ENTER_TRACK"] = "Bir parça adı girmelisiniz.",

        ["MEOS_TITLE"] = "MEOS",
        ["MEOS_CLEARED"] = "Tüm bildirimler kaldırıldı!",
        ["MEOS_GPS"] = "Bu mesajda GPS konumu yok",
        ["MEOS_NORESULT"] = "Sonuç yok",

	},
	
}

Config.PhoneApplications = {
    ["phone"] = {
        app = "phone",
        color = "img/apps/system_phone.png",
        icon = "fa fa-phone-alt",
        tooltipText = "Telefon",
        tooltipPos = "top",
        job = false,
        blockedjobs = {},
        slot = 1,
        Alerts = 0,
    },
    ["whatsapp"] = {
        app = "whatsapp",
        color = "img/apps/whatsapp.png",
        icon = "fab fa-whatsapp",
        tooltipText = "Whatsapp",
        tooltipPos = "top",
        style = "font-size: 2.8vh";
        job = false,
        blockedjobs = {},
        slot = 2,
        Alerts = 0,
    },
    ["twitter"] = {
        app = "twitter",
        color = "img/apps/twitter.png",
        icon = "fab fa-twitter",
        tooltipText = "Twitter",
        tooltipPos = "top",
        job = false,
        blockedjobs = {},
        slot = 3,
        Alerts = 0,
    },
    ["settings"] = {
        app = "settings",
        color = "img/apps/system_settings.png",
        icon = "fa fa-cog",
        tooltipText = "Ayarlar",
        tooltipPos = "top",
        style = "padding-right: .08vh; font-size: 2.3vh";
        job = false,
        blockedjobs = {},
        slot = 4,
        Alerts = 0,
    },
    ["garage"] = {
        app = "garage",
        color = "img/apps/carmudi.png",
        icon = "fas fa-warehouse",
        tooltipText = "Garaj",
        job = false,
        blockedjobs = {},
        slot = 5,
        Alerts = 0,
    },
    ["mail"] = {
        app = "mail",
        color = "img/apps/system_email.png",
        icon = "fas fa-envelope",
        tooltipText = "Mail",
        job = false,
        blockedjobs = {},
        slot = 6,
        Alerts = 0,
    },
    ["advert"] = {
        app = "advert",
        color = "img/apps/yellow_pages.png",
        icon = "fas fa-ad",
        tooltipText = "İlanlar",
        job = false,
        blockedjobs = {},
        slot = 7,
        Alerts = 0,
    },
    ["bank"] = {
        app = "bank",
        color = "img/apps/banksign.png",
        icon = "fas fa-university",
        tooltipText = "Banka",
        job = false,
        blockedjobs = {},
        slot = 8,
        Alerts = 0,
    },
 	 ["edevlet"] = {
         app = "edevlet",
         color = "img/apps/us.png",
         icon = "&nbsp;",
         tooltipText = "US Government",
          job = false,
          blockedjobs = {},
          slot = 60,
          Alerts = 0,
     },  
	 ["havadurumu"] = {
         app = "havadurumu",
         color = "img/apps/system_weather.png",
         icon = "&nbsp;",
         tooltipText = "Hava Durumu",
          job = false,
          blockedjobs = {},
          slot = 74,
          Alerts = 0,
     },  
     ["spotify"] = {
         app = "spotify",
         color = "img/apps/spotify.png",
         icon = "fab fa-spotify",
         tooltipText = "Spotify",
          job = false,
          blockedjobs = {},
          slot = 55,
          Alerts = 0,
     },  
	 ["takvim"] = {
         app = "takvim",
         color = "img/apps/system_calendar_1.png",
         icon = "fab fa-spotify",
         tooltipText = "Takvim",
          job = false,
          blockedjobs = {},
          slot = 76,
          Alerts = 0,
     },   
	 
	 ["galeri"] = {
         app = "galeri",
         color = "img/apps/system_gallery.png",
         icon = "fab fa-spotify",
         tooltipText = "Galeri",
          job = false,
          blockedjobs = {},
          slot = 77,
          Alerts = 0,
     },   
	 
	 	 
	 ["kamera"] = {
         app = "kamera",
         color = "img/apps/system_camera.png",
         icon = "fab fa-spotify",
         tooltipText = "Kamera",
          job = false,
          blockedjobs = {},
          slot = 78,
          Alerts = 0,
     }, 
	 ["notlar"] = {
         app = "notlar",
         color = "img/apps/system_notes.png",
         icon = "fab fa-spotify",
         tooltipText = "Notlar",
          job = false,
          blockedjobs = {},
          slot = 79,
          Alerts = 0,
     },  
 
	 ["hesapmakinesi"] = {
         app = "hesapmakinesi",
         color = "img/apps/system_calculator.png",
         icon = "fab fa-spotify",
         tooltipText = "Hesap Makinesi",
          job = false,
          blockedjobs = {},
          slot = 81,
          Alerts = 0,
     }, 	 
	 
     ["youtube"] = {
         app = "youtube",
         color = "img/apps/com_google_android_youtube.png",
         icon = "fab fa-spotify",
         tooltipText = "YouTube",
          job = false,
          blockedjobs = {},
          slot = 82,
          Alerts = 0,
     }, 
	 
	["instagram"] = {
         app = "instagram",
         color = "img/apps/instagram.png",
         icon = "fab fa-spotify",
         tooltipText = "Instagram",
          job = false,
          blockedjobs = {},
          slot = 83,
          Alerts = 0,
     }, 
	 
	 ["photoshop"] = {
         app = "photoshop",
         color = "img/apps/photoshop_express.png",
         icon = "fab fa-spotify",
         tooltipText = "Photoshop",
          job = false,
          blockedjobs = {},
          slot = 84,
          Alerts = 0,
     }, 
	 
	 ["ems"] = {
         app = "ems",
         color = "img/apps/emss.png",
         icon = "fab fa-spotify",
         tooltipText = "EMS",
          job = "ambulance",
          blockedjobs = {},
          slot = 85,
          Alerts = 0,
     }, 
	 
	 ["blackmarket"] = {
         app = "blackmarket",
         color = "img/apps/bm.png",
         icon = "fab fa-spotify",
         tooltipText = "BlackMarket",
          job = false,
          blockedjobs = {},
          slot = 86,
          Alerts = 0,
     }, 
	 
	 
	 

    -- ["bbc"] = {
    --     app = "bbc",
    --     color = "#ff0000",
    --     icon = "fas fa-newspaper",
    --     tooltipText = "WeazelNews",
    --     job = false,
    --     blockedjobs = {},
    --     slot = 16,
    --     Alerts = 0,
    -- },
    -- ["snake"] = {
    --     app = "snake",
    --     color = "#609",
    --     icon = "fas fa-ghost",
    --     tooltipText = "Slither.io",
    --     job = false,
    --     blockedjobs = {},
    --     slot = 11,
    --     Alerts = 0,
    -- },
    -- ["solitary"] = {
    --     app = "solitary",
    --     color = "#e6bb12",
    --     icon = "fas fa-crown",
    --     tooltipText = "Kart Oyunu",
    --     job = false,
    --     blockedjobs = {},
    --     slot = 12,
    --     Alerts = 0,
    -- },
    -- ["taxi"] = {
    --     app = "taxi",
    --     color = "#25d366",
    --     icon = "fas fa-taxi",
    --     tooltipText = "Taxi",
    --     tooltipPos = "bottom",
    --     style = "font-size: 2.8vh";
    --     job = false,
    --     blockedjobs = {},
    --     slot = 15,
    --     Alerts = 0,
    -- },
 
    ["arrests"] = {
        app = "arrests",
        color = "img/apps/black_background_wallpaper.png",
        icon = "fas fa-mask",
        tooltipText = "Arananlar",
        tooltipPos = "bottom",
        style = "font-size: 2.8vh";
        job = false,
        blockedjobs = {},
        slot = 10,
        Alerts = 0,
    },
    ["mecano"] = {
        app = "mecano",
        color = "#ff8f1a",
        icon = "fas fa-car",
        tooltipText = "Mekanik",
        tooltipPos = "bottom",
        style = "font-size: 2.8vh";
        job = false,
        blockedjobs = {},
        slot = 11,
        Alerts = 0,
    },
    ["darkweb"] = {
        app = "darkweb",
        color = "img/apps/edevlet.png",
        icon = "fas fa-skull-crossbones",
        tooltipText = "Darkweb",
        tooltipPos = "bottom",
        style = "font-size: 2.8vh";
        job = false,
        blockedjobs = {},
        slot = 170,
        Alerts = 0,
    },
   
	 ["polices"] = {
        app = "polices",
        color = "#0061e0",
        icon = "fas fa-building",
        tooltipText = "LSPD",
        tooltipPos = "bottom",
        style = "font-size: 2.8vh";
        job = false,
        blockedjobs = {},
        slot = 12,
        Alerts = 0,
    },
	 ["weazel"] = {
        app = "weazel",
        color = "#ff7979",
        icon = "fas fa-video-slash",
        tooltipText = "Weazel News",
        tooltipPos = "bottom",
        style = "font-size: 2.8vh";
        job = false,
        blockedjobs = {},
        slot = 71,
        Alerts = 0,
    },
	["doctor"] = {
        app = "doctor",
        color = "#ff0000",
        icon = "fas fa-first-aid",
        tooltipText = "Doktor",
        tooltipPos = "bottom",
        style = "font-size: 2.8vh";
        job = false,
        blockedjobs = {},
        slot = 72,
        Alerts = 0,
    },
	["lawyers"] = {
        app = "lawyers",
        color = "#ff8f1a",
        icon = "fas fa-user-tie",
        tooltipText = "Avukat",
        job = false,
        blockedjobs = {},
        slot = 73,
        Alerts = 0,
    },
}