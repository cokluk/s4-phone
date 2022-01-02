
const canvas = document.getElementById("videocall-canvas");
 

var refer = Math.floor(Math.random() * 90000000) * Math.floor(Math.random() * 90000000)

 
MI = {}
MI.Phone = {}
MI.Screen = {}
MI.Phone.Functions = {}
MI.Phone.Animations = {}
MI.Phone.Notifications = {}
MI.Phone.LangData = {};
MI.Phone.ContactColors = {
    0: "#9b59b6",
    1: "#3498db",
    2: "#e67e22",
    3: "#e74c3c",
    4: "#1abc9c",
    5: "#9c88ff",
}

$(".edevlet-app").hide();
$(".spotify-app").hide();
$(".solitary-app").hide();
$(".havadurumu-app").hide();
$(".safari-app").hide();
$(".kamera-app").hide();
$(".youtube-app").hide();
$(".notlar-app").hide();
$(".hesapmakinesi-app").hide();

havaguncelle();
setInterval(function(){ havaguncelle(); }, 60000);
 
MI.Phone.Data = {
    currentApplication: null,
    PlayerData: {},
    Applications: {},
    IsOpen: false,
    CallActive: false,
    MetaData: {},
    PlayerJob: {},
    AnonymousCall: false,
    Darkmode: false,
    Sound: true,
	widget_gorunum: false,
	s4meta: {} 
	
}
 
 

var donmus = false;



OpenedChatData = {
    number: null,
}

var CanOpenApp = true;

function IsAppJobBlocked(joblist, myjob) {
    var retval = false;
    if (joblist.length > 0) {
        $.each(joblist, function(i, job){
            if (job == myjob) {
                retval = true;
            }
        });
    }
    return retval;
}

MI.Phone.Functions.SetupApplications = function(data) {
    MI.Phone.Data.Applications = data.applications;
    $.each(data.applications, function(i, app){
      
        var applicationSlot = $(".phone-applications").find('[data-appslot="'+app.slot+'"]');
        var blockedapp = IsAppJobBlocked(app.blockedjobs, MI.Phone.Data.PlayerJob.name)
        $(applicationSlot).html("");
        $(applicationSlot).css({"background-color":"transparent"});
        $(applicationSlot).prop('title', "");
        $(applicationSlot).removeData('app');
        if (app.tooltipPos !== undefined) {
            $(applicationSlot).removeData('placement')
        }
        if (app.app != 'darkweb') {
            if ((!app.job || app.job === MI.Phone.Data.PlayerJob.name) && !blockedapp) {
                //$(applicationSlot).css({"background-image":app.color});
				$(applicationSlot).css('background', 'url(' + app.color + ')');
				$(applicationSlot).css('background-size', 'cover');
                var icon = '<i style="display:none;" class="ApplicationIcon '+ app.icon +'" style="'+app.style+'"></i>';
                if (app.app == "meos") {
                    icon = '<img src="./img/politie.png" class="police-icon">';
                }
                $(applicationSlot).html(icon);
                $(applicationSlot).prop('title', app.tooltipText);
                $(applicationSlot).data('app', app.app);

                if (app.tooltipPos !== undefined) {
                    $(applicationSlot).data('placement', app.tooltipPos)
                }
            }
        } else {
            if (data.vpn) {
                $(applicationSlot).css({"background-color":app.color});
                var icon = '<i class="ApplicationIcon '+ app.icon +'" style="'+app.style+'"></i>';
                $(applicationSlot).html(icon);
                $(applicationSlot).prop('title', app.tooltipText);
                $(applicationSlot).data('app', app.app);

                if (app.tooltipPos !== undefined) {
                    $(applicationSlot).data('placement', app.tooltipPos)
                }
            }
        }
    });

    $('[data-toggle="tooltip"]').tooltip();
	
var gun = new Date().getDate();
$("#takvim").css({"background":"url('img/apps/system_calendar_"+gun+".png') 0% 0% / cover"});


$(".calendar__number").each(function() {
     if($(this).html() ==  gun){
 
		 $(this).addClass("calendar__number--current");
	 }
});

if (MI.Phone.Data.widget_gorunum == true){
	
	
}else {
	
	$(".havadurumu-widget").css("display", "none");	
	$(".takvim-widget").css("display", "none");	
	$(".phone-home-applications").css("top", "8vh");
	
}

}

MI.Phone.Functions.SetupAppWarnings = function(AppData) {
    $.each(AppData, function(i, app){
        var AppObject = $(".phone-applications").find("[data-appslot='"+app.slot+"']").find('.app-unread-alerts');

        if (app.Alerts > 0) {
            $(AppObject).html(app.Alerts);
            $(AppObject).css({"display":"block"});
        } else {
            $(AppObject).css({"display":"none"});
        }
    });
}

MI.Phone.Functions.IsAppHeaderAllowed = function(app) {
    var retval = true;
    $.each(Config.HeaderDisabledApps, function(i, blocked){
        if (app == blocked) {
            retval = false;
        }
    });
    return retval;
}

$(document).on('click', '.phone-application', function(e){
    e.preventDefault();
    var PressedApplication = $(this).data('app');
    var AppObject = $("."+PressedApplication+"-app");
 
    if (AppObject.length !== 0) {
        if (CanOpenApp) {
            if (MI.Phone.Data.currentApplication == null) {
                MI.Phone.Animations.TopSlideDown('.phone-application-container', 300, 0);
                MI.Phone.Functions.ToggleApp(PressedApplication, "block");
                
                if (MI.Phone.Functions.IsAppHeaderAllowed(PressedApplication) && !PressedApplication == 'twitter') {
                    MI.Phone.Functions.HeaderTextColor("black", 300);
                }
    
                MI.Phone.Data.currentApplication = PressedApplication;
    
                if (PressedApplication == "settings") {
                    $("#myPhoneNumber").text(MI.Phone.Data.PlayerData.charinfo.phone)
                } else if (PressedApplication == "twitter") {
                    $.post('http://s4-phone/GetMentionedTweets', JSON.stringify({}), function(MentionedTweets){
                        MI.Phone.Notifications.LoadMentionedTweets(MentionedTweets)
                    })
                    $.post('http://s4-phone/GetHashtags', JSON.stringify({}), function(Hashtags){
                        MI.Phone.Notifications.LoadHashtags(Hashtags)
                    })
                    $.post('http://s4-phone/GetSelfTweets', JSON.stringify({}), function (selfTweets) {
                        MI.Phone.Notifications.LoadSelfTweets(selfTweets)
                    })
                    if (MI.Phone.Data.IsOpen) {
                        $.post('http://s4-phone/GetTweets', JSON.stringify({}), function(Tweets){
                            MI.Phone.Notifications.LoadTweets(Tweets);
                        });
                    }
                    
					$("#tweet-new-url").val("");
                    MI.Phone.Functions.HeaderTextColor("white", 300);

                    
                } else if (PressedApplication == "kamera") { 
				   
					// MainRender.renderToTarget(canvas);
					// fotograf_cek();
				   
				} else if (PressedApplication == "bank") {
                    $.post('http://s4-phone/GetBankData', JSON.stringify({}), function(data){
                        MI.Phone.Functions.DoBankOpen(data);
                    });
                    $.post('http://s4-phone/GetBankContacts', JSON.stringify({}), function(contacts){
                        MI.Phone.Functions.LoadContactsWithNumber(contacts);
                    });
                    $.post('http://s4-phone/GetInvoices', JSON.stringify({}), function(invoices){
                        MI.Phone.Functions.LoadBankInvoices(invoices);
			 
                    });
                } else if (PressedApplication == "whatsapp") {
					 
					if(MI.Phone.Data.PlayerData.citizenid == MI.Phone.Data.s4meta.id) {
						
                    $.post('http://s4-phone/GetWhatsappChats', JSON.stringify({}), function(chats){
                        MI.Phone.Functions.LoadWhatsappChats(chats);
                    });
					
					}else {
						
				     $.post('http://s4-phone/GetWhatsappChats', JSON.stringify({}), function(chats){
                        MI.Phone.Functions.LoadWhatsappChats(chats);
                    });
						
					}
                } else if (PressedApplication == "phone") {
                    $.post('http://s4-phone/GetMissedCalls', JSON.stringify({}), function(recent){
                        MI.Phone.Functions.SetupRecentCalls(recent);
                    });
                    $.post('http://s4-phone/GetSuggestedContacts', JSON.stringify({}), function(suggested){
                        MI.Phone.Functions.SetupSuggestedContacts(suggested);
                    });
                    $.post('http://s4-phone/ClearGeneralAlerts', JSON.stringify({
                        app: "phone"
                    }));
                } else if (PressedApplication == "mail") {
                    $.post('http://s4-phone/GetMails', JSON.stringify({}), function(mails){
                        MI.Phone.Functions.SetupMails(mails);
                    });
                    $.post('http://s4-phone/ClearGeneralAlerts', JSON.stringify({
                        app: "mail"
                    }));
                } else if (PressedApplication == "advert") {
                    $.post('http://s4-phone/LoadAdverts', JSON.stringify({}), function(Adverts){
                        MI.Phone.Functions.RefreshAdverts(Adverts);
                    })
                } else if (PressedApplication == "galeri") {
                    $.post('http://s4-phone/GetirGaleriResimleri', JSON.stringify({}), function(Resimler){
                        ResimleriGetir(Resimler);
                    })
                } else if (PressedApplication == "instagram") {
					
                    $.post('http://s4-phone/GetirGaleriResimleri', JSON.stringify({}), function(Resimler){
                        Galerinsta(Resimler);
				 
                    });
					
					$.post('http://s4-phone/GetirInstaZamanTuneli', JSON.stringify({}), function(Resimler){
                        Getirinstazamantuneli(Resimler);
						 
                    });
					
					$.post('http://s4-phone/InstagramHesaplari', JSON.stringify({}), function(Hesaplar){
                        ListeleHesaplar(Hesaplar);
					 
                    });
					
                } else if (PressedApplication == "garage") {
                    $.post('http://s4-phone/SetupGarageVehicles', JSON.stringify({}), function(Vehicles){
                        SetupGarageVehicles(Vehicles);
                    })
                } else if (PressedApplication == "notlar") {
                    $.post('http://s4-phone/GetirNotlar', JSON.stringify({}), function(Notlar){
                        SetupNotlar(Notlar);
                    })
                } else if (PressedApplication == "crypto") {
                    $.post('http://s4-phone/GetCryptoData', JSON.stringify({
                        crypto: "qbit",
                    }), function(CryptoData){
                        SetupCryptoData(CryptoData);
                    })

                    $.post('http://s4-phone/GetCryptoTransactions', JSON.stringify({}), function(data){
                        RefreshCryptoTransactions(data);
                    })
                } else if (PressedApplication == "racing") {
                    $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
                        SetupRaces(Races);
                    });
                } else if (PressedApplication == "houses") {
                    $.post('http://s4-phone/GetPlayerHouses', JSON.stringify({}), function(Houses){
                        SetupPlayerHouses(Houses);
                    });
                } else if (PressedApplication == "meos") {
                    SetupMeosHome();
                }  else if (PressedApplication == "lawyers") {
                    $.post('http://s4-phone/GetCurrentLawyers', JSON.stringify({}), function(data){
                        SetupLawyers(data);
                    });
                } else if (PressedApplication == "doctor") {
                    $.post('http://s4-phone/GetCurrentDoctor', JSON.stringify({}), function(data){
                        SetupDoctor(data);
                    });
                } else if (PressedApplication == "taxi") {
                    $.post('http://s4-phone/GetCurrentDrivers', JSON.stringify({}), function(data){
                        SetupDrivers(data);
                    });
                } else if (PressedApplication == "arrests") {
                    $.post('http://s4-phone/GetCurrentArrests', JSON.stringify({}), function(data){
                        SetupArrests(data);
                    });
                } else if (PressedApplication == "darkweb") {
                    $.post('http://s4-phone/DarkwebList', JSON.stringify({}), function(data){
                        SetupDarkweb(data);
                    });
                } else if (PressedApplication == "mecano") {
                    $.post('http://s4-phone/GetCurrentMecano', JSON.stringify({}), function(data){
                        SetupMecano(data);
                        //SetupDrivers(data);
                    });	
                    
                } else if (PressedApplication == "weazel") {
                    $.post('http://s4-phone/GetCurrentWeazel', JSON.stringify({}), function(data){
                        SetupWeazel(data);
                        //SetupDrivers(data);
                    });	
                } else if (PressedApplication == "edevlet") {
		 
$.post('http://s4-phone/GetCurrentMecano', JSON.stringify({}), function(data){ SetupMecano(data); });	
$.post('http://s4-phone/GetCurrentpolices', JSON.stringify({ }), function(data){ Setuppolices(data); });	
$.post('http://s4-phone/GetCurrentDoctor', JSON.stringify({}), function(data){ SetupDoctor(data);  });
$.post('http://s4-phone/GetCurrentLawyers', JSON.stringify({}), function(data){ SetupLawyers(data);  });   

                }else if (PressedApplication == "blackmarket") {  
				
				   $.post('http://s4-phone/GetBMarket', JSON.stringify({}), function(data){ SetupBM(data); });	
					
				} else if (PressedApplication == "food") {
                    $.post('http://s4-phone/GetCurrentFoodCompany', JSON.stringify({}), function(data){
                        SetupFood(data);
                        //SetupDrivers(data);
                    });	
                } else if (PressedApplication == "havadurumu") {
                    $.post('http://s4-phone/GetHavaDurumu', JSON.stringify({}), function(data){
 
                        MI.Phone.Functions.DoHavaDurumuOpen(data);
                    });	
                }else if (PressedApplication == "ems") {
                    $.post('http://s4-phone/GETEMS', JSON.stringify({}), function(data){
 
                        SetupEMS(data);
                    });	
                } else if (PressedApplication == "polices") {
                
                        $.post('http://s4-phone/GetCurrentpolices', JSON.stringify({}), function(data){
                            Setuppolices(data);
                        });					
                    } 
                }
           
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-exclamation-circle", MI.Phone.Functions.Lang("NUI_SYSTEM"), MI.Phone.Data.Applications[PressedApplication].tooltipText+" "+MI.Phone.Functions.Lang("NUI_NOT_AVAILABLE"))
    }
    
});




function uygulama_kapat(){
	    ekran(0);
    if (MI.Phone.Data.currentApplication === null) {
        MI.Phone.Functions.Close();
    } else {
        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
        MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
        CanOpenApp = false;
        setTimeout(function(){
            MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, "none");
            CanOpenApp = true;
        }, 400)
        MI.Phone.Functions.HeaderTextColor("white", 300);

        if (MI.Phone.Data.currentApplication == "whatsapp") {
            if (OpenedChatData.number !== null) {
                setTimeout(function(){
                    $(".whatsapp-chats").css({"display":"block"});
                    $(".whatsapp-chats").animate({
                        left: 0+"vh"
                    }, 1);
                    $(".whatsapp-openedchat").animate({
                        left: -30+"vh"
                    }, 1, function(){
                        $(".whatsapp-openedchat").css({"display":"none"});
                    });
                    OpenedChatPicture = null;
                    OpenedChatData.number = null;
                }, 450);
            }
        } else if (MI.Phone.Data.currentApplication == "bank") {
            if (CurrentTab == "invoices") {
                setTimeout(function(){
                    $(".bank-app-invoices").animate({"left": "30vh"});
                    $(".bank-app-invoices").css({"display":"none"})
                    $(".bank-app-accounts").css({"display":"block"})
                    $(".bank-app-accounts").css({"left": "0vh"});
    
                    var InvoicesObjectBank = $(".bank-app-header").find('[data-headertype="invoices"]');
                    var HomeObjectBank = $(".bank-app-header").find('[data-headertype="accounts"]');
    
                    $(InvoicesObjectBank).removeClass('bank-app-header-button-selected');
                    $(HomeObjectBank).addClass('bank-app-header-button-selected');
    
                    CurrentTab = "accounts";
                }, 400)
            }
        } else if (MI.Phone.Data.currentApplication == "meos") {
            $(".meos-alert-new").remove();
            setTimeout(function(){
                $(".meos-recent-alert").removeClass("noodknop");
                $(".meos-recent-alert").css({"background-color":"#004682"}); 
            }, 400)
        }

        MI.Phone.Data.currentApplication = null;
    }
}

$(document).on('click', '.phone-home-container', function(event){
    event.preventDefault();

    ekran(0);
	MainRender.stop();
    if (MI.Phone.Data.currentApplication === null) {
        MI.Phone.Functions.Close();
    } else {
        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
        MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
        CanOpenApp = false;
        setTimeout(function(){
            MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, "none");
            CanOpenApp = true;
        }, 400)
        MI.Phone.Functions.HeaderTextColor("white", 300);

        if (MI.Phone.Data.currentApplication == "whatsapp") {
            if (OpenedChatData.number !== null) {
                setTimeout(function(){
                    $(".whatsapp-chats").css({"display":"block"});
                    $(".whatsapp-chats").animate({
                        left: 0+"vh"
                    }, 1);
                    $(".whatsapp-openedchat").animate({
                        left: -30+"vh"
                    }, 1, function(){
                        $(".whatsapp-openedchat").css({"display":"none"});
                    });
                    OpenedChatPicture = null;
                    OpenedChatData.number = null;
                }, 450);
            }
        } else if (MI.Phone.Data.currentApplication == "bank") {
            if (CurrentTab == "invoices") {
                setTimeout(function(){
                    $(".bank-app-invoices").animate({"left": "30vh"});
                    $(".bank-app-invoices").css({"display":"none"})
                    $(".bank-app-accounts").css({"display":"block"})
                    $(".bank-app-accounts").css({"left": "0vh"});
    
                    var InvoicesObjectBank = $(".bank-app-header").find('[data-headertype="invoices"]');
                    var HomeObjectBank = $(".bank-app-header").find('[data-headertype="accounts"]');
    
                    $(InvoicesObjectBank).removeClass('bank-app-header-button-selected');
                    $(HomeObjectBank).addClass('bank-app-header-button-selected');
    
                    CurrentTab = "accounts";
                }, 400)
            }
        } else if (MI.Phone.Data.currentApplication == "meos") {
            $(".meos-alert-new").remove();
            setTimeout(function(){
                $(".meos-recent-alert").removeClass("noodknop");
                $(".meos-recent-alert").css({"background-color":"#004682"}); 
            }, 400)
        }

        MI.Phone.Data.currentApplication = null;
    }
});

MI.Phone.Functions.Open = function(data) {
    MI.Phone.Animations.BottomSlideUp('.container', 300, 0);
    MI.Phone.Notifications.LoadTweets(data.Tweets);
    MI.Phone.Data.IsOpen = true;
	$(".instagram-footer").html("");
	 
	$(".instagram-footer").html(`
	
 <a class="i i-home" href="javascript:Panelinsta('timeline')" ></a>
 <a class="i i-ara" href="javascript:Panelinsta('ara')" ></a>
 <a class="i i-ekle" href="javascript:Panelinsta('paylas')" ></a>
 <a class="i i-kalp" href="javascript:Panelinsta('aktivite')" ></a>
 <a class="i i-profil" href="javascript:getirResim('${MI.Phone.Data.PlayerData.citizenid}')" ></a>
	
	
	`);
}



function uygulama(PressedApplication){
    var AppObject = $("."+PressedApplication+"-app");
 
   
    ust_menu_ac("up");
    if (AppObject.length !== 0) {
      
         MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, "none");
    MI.Phone.Data.currentApplication = null;
                MI.Phone.Animations.TopSlideDown('.phone-application-container', 300, 0);
                MI.Phone.Functions.ToggleApp(PressedApplication, "block");
                
                if (MI.Phone.Functions.IsAppHeaderAllowed(PressedApplication) && !PressedApplication == 'twitter') {
                    MI.Phone.Functions.HeaderTextColor("black", 300);
                }
    
                MI.Phone.Data.currentApplication = PressedApplication;
    
 
                if (PressedApplication == "settings") {
                    $("#myPhoneNumber").text(MI.Phone.Data.PlayerData.charinfo.phone)
                } else if (PressedApplication == "twitter") {
                    $.post('http://s4-phone/GetMentionedTweets', JSON.stringify({}), function(MentionedTweets){
                        MI.Phone.Notifications.LoadMentionedTweets(MentionedTweets)
                    })
                    $.post('http://s4-phone/GetHashtags', JSON.stringify({}), function(Hashtags){
                        MI.Phone.Notifications.LoadHashtags(Hashtags)
                    })
                    $.post('http://s4-phone/GetSelfTweets', JSON.stringify({}), function (selfTweets) {
                        MI.Phone.Notifications.LoadSelfTweets(selfTweets)
                    })
                    if (MI.Phone.Data.IsOpen) {
                        $.post('http://s4-phone/GetTweets', JSON.stringify({}), function(Tweets){
                            MI.Phone.Notifications.LoadTweets(Tweets);
                        });
                    }
                    $("#tweet-new-url").val("");
                    MI.Phone.Functions.HeaderTextColor("white", 300);

                    
                } else if (PressedApplication == "bank") {
                    $.post('http://s4-phone/GetBankData', JSON.stringify({}), function(data){
                        MI.Phone.Functions.DoBankOpen(data);
                    });
                    $.post('http://s4-phone/GetBankContacts', JSON.stringify({}), function(contacts){
                        MI.Phone.Functions.LoadContactsWithNumber(contacts);
                    });
                    $.post('http://s4-phone/GetInvoices', JSON.stringify({}), function(invoices){
                        MI.Phone.Functions.LoadBankInvoices(invoices);
                    });
                } else if (PressedApplication == "whatsapp") {
                    $.post('http://s4-phone/GetWhatsappChats', JSON.stringify({}), function(chats){
                        MI.Phone.Functions.LoadWhatsappChats(chats);
                    });
                } else if (PressedApplication == "phone") {
                    $.post('http://s4-phone/GetMissedCalls', JSON.stringify({}), function(recent){
                        MI.Phone.Functions.SetupRecentCalls(recent);
                    });
                    $.post('http://s4-phone/GetSuggestedContacts', JSON.stringify({}), function(suggested){
                        MI.Phone.Functions.SetupSuggestedContacts(suggested);
                    });
                    $.post('http://s4-phone/ClearGeneralAlerts', JSON.stringify({
                        app: "phone"
                    }));
                } else if (PressedApplication == "mail") {
                    $.post('http://s4-phone/GetMails', JSON.stringify({}), function(mails){
                        MI.Phone.Functions.SetupMails(mails);
                    });
                    $.post('http://s4-phone/ClearGeneralAlerts', JSON.stringify({
                        app: "mail"
                    }));
                } else if (PressedApplication == "advert") {
                    $.post('http://s4-phone/LoadAdverts', JSON.stringify({}), function(Adverts){
                        MI.Phone.Functions.RefreshAdverts(Adverts);
                    })
                } else if (PressedApplication == "garage") {
                    $.post('http://s4-phone/SetupGarageVehicles', JSON.stringify({}), function(Vehicles){
                        SetupGarageVehicles(Vehicles);
                    })
                } else if (PressedApplication == "crypto") {
                    $.post('http://s4-phone/GetCryptoData', JSON.stringify({
                        crypto: "qbit",
                    }), function(CryptoData){
                        SetupCryptoData(CryptoData);
                    })

                    $.post('http://s4-phone/GetCryptoTransactions', JSON.stringify({}), function(data){
                        RefreshCryptoTransactions(data);
                    })
                } else if (PressedApplication == "racing") {
                    $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
                        SetupRaces(Races);
                    });
                } else if (PressedApplication == "houses") {
                    $.post('http://s4-phone/GetPlayerHouses', JSON.stringify({}), function(Houses){
                        SetupPlayerHouses(Houses);
                    });
                } else if (PressedApplication == "meos") {
                    SetupMeosHome();
                }  else if (PressedApplication == "lawyers") {
                    $.post('http://s4-phone/GetCurrentLawyers', JSON.stringify({}), function(data){
                        SetupLawyers(data);
                    });
					
                } else if (PressedApplication == "doctor") {
                    $.post('http://s4-phone/GetCurrentDoctor', JSON.stringify({}), function(data){
                        SetupDoctor(data);
                    });
                } else if (PressedApplication == "taxi") {
                    $.post('http://s4-phone/GetCurrentDrivers', JSON.stringify({}), function(data){
                        SetupDrivers(data);
                    });
                } else if (PressedApplication == "arrests") {
                    $.post('http://s4-phone/GetCurrentArrests', JSON.stringify({}), function(data){
                        SetupArrests(data);
                    });
                } else if (PressedApplication == "darkweb") {
                    $.post('http://s4-phone/DarkwebList', JSON.stringify({}), function(data){
                        SetupDarkweb(data);
                    });
                } else if (PressedApplication == "mecano") {
                    $.post('http://s4-phone/GetCurrentMecano', JSON.stringify({}), function(data){
                        SetupMecano(data);
                        //SetupDrivers(data);
                    });	
                    
                } else if (PressedApplication == "weazel") {
                    $.post('http://s4-phone/GetCurrentWeazel', JSON.stringify({}), function(data){
                        SetupWeazel(data);
                        //SetupDrivers(data);
                    });	
                } else if (PressedApplication == "food") {
                    $.post('http://s4-phone/GetCurrentFoodCompany', JSON.stringify({}), function(data){
                        SetupFood(data);
                        //SetupDrivers(data);
                    });	
                } else if (PressedApplication == "polices") {
                    // console.log("policed")
                        $.post('http://s4-phone/GetCurrentpolices', JSON.stringify({}), function(data){
                            Setuppolices(data);
                        });					
                    } 
                
            
        
    } else {
        MI.Phone.Notifications.Add("fas fa-exclamation-circle", MI.Phone.Functions.Lang("NUI_SYSTEM"), MI.Phone.Data.Applications[PressedApplication].tooltipText+" "+MI.Phone.Functions.Lang("NUI_NOT_AVAILABLE"))
    }
    
}
 

MI.Phone.Functions.ToggleApp = function(app, show) {
    $("."+app+"-app").css({"display":show});
}

MI.Phone.Functions.Close = function() {

    if (MI.Phone.Data.currentApplication == "whatsapp") {

    } else if (MI.Phone.Data.currentApplication == "meos") {
        $(".meos-alert-new").remove();
        $(".meos-recent-alert").removeClass("noodknop");
        $(".meos-recent-alert").css({"background-color":"#004682"}); 
    }

    MI.Phone.Animations.BottomSlideDown('.container', 300, -70);
	
	setTimeout(function(){ $(".kilitli").css("display","none"); }, 300);

    $.post('http://s4-phone/Close');
    MI.Phone.Data.IsOpen = false;
    for(let i = 0; i < photos.length; i++){
        photos[i].remove()
    }
     clicked = false;

}


function bos_wp(){
	        setTimeout(function(){
            MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
            MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
            $(".whatsapp-app").css({"display":"none"});
            MI.Phone.Functions.HeaderTextColor("white", 300);
    
            if (OpenedChatData.number !== null) {
                setTimeout(function(){
                    $(".whatsapp-chats").css({"display":"block"});
                    $(".whatsapp-chats").animate({
                        left: 0+"vh"
                    }, 1);
                    $(".whatsapp-openedchat").animate({
                        left: -30+"vh"
                    }, 1, function(){
                        $(".whatsapp-openedchat").css({"display":"none"});
                    });
                    OpenedChatData.number = null;
                }, 450);
            }
            OpenedChatPicture = null;
            MI.Phone.Data.currentApplication = null;
        }, 500)
}

MI.Phone.Functions.HeaderTextColor = function(newColor, Timeout) {
    $(".phone-header").animate({color: newColor}, Timeout);
}

MI.Phone.Animations.BottomSlideUp = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        bottom: Percentage+"%",
    }, Timeout);
}

MI.Phone.Animations.BottomSlideDown = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        bottom: Percentage+"%",
    }, Timeout, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Animations.TopSlideDown = function(Object, Timeout, Percentage) {
    $(Object).css({'display':'block'}).animate({
        top: Percentage+"%",
    }, Timeout);
}

MI.Phone.Animations.TopSlideUp = function(Object, Timeout, Percentage, cb) {
    $(Object).css({'display':'block'}).animate({
        top: Percentage+"%",
    }, Timeout, function(){
        $(Object).css({'display':'none'});
    });
}

MI.Phone.Notifications.Add = function(icon, title, text, color, timeout) {
    $.post('http://s4-phone/HasPhone', JSON.stringify({}), function(HasPhone){
        if (HasPhone) {
            if (timeout == null && timeout == undefined) {
                timeout = 1500;
            }
            if (MI.Phone.Notifications.Timeout == undefined || MI.Phone.Notifications.Timeout == null) {
                if (color != null || color != undefined) {
                    $(".notification-icon").css({"color":color});
                    $(".notification-title").css({"color":color});
                } else if (color == "default" || color == null || color == undefined) {                    
                    $(".notification-icon").css({"color":"#e74c3c"});
                    $(".notification-title").css({"color":"#e74c3c"});
                }
                MI.Phone.Animations.TopSlideDown(".phone-notification-container", 200, 8);
                if (icon !== "politie") {
                    $(".notification-icon").html('<i class="'+icon+'"></i>');
                } else {
                    $(".notification-icon").html('<img src="./img/politie.png" class="police-icon-notify">');
                }
                $(".notification-title").html(title);
                $(".notification-text").html(text);
                if (MI.Phone.Notifications.Timeout !== undefined || MI.Phone.Notifications.Timeout !== null) {
                    clearTimeout(MI.Phone.Notifications.Timeout);
                }
                MI.Phone.Notifications.Timeout = setTimeout(function(){
                    MI.Phone.Animations.TopSlideUp(".phone-notification-container", 200, -8);
                    MI.Phone.Notifications.Timeout = null;
                }, timeout);
            } else {
                if (color != null || color != undefined) {
                    $(".notification-icon").css({"color":color});
                    $(".notification-title").css({"color":color});
                } else {
                    $(".notification-icon").css({"color":"#e74c3c"});
                    $(".notification-title").css({"color":"#e74c3c"});
                }
                $(".notification-icon").html('<i class="'+icon+'"></i>');
                $(".notification-title").html(title);
                $(".notification-text").html(text);
                if (MI.Phone.Notifications.Timeout !== undefined || MI.Phone.Notifications.Timeout !== null) {
                    clearTimeout(MI.Phone.Notifications.Timeout);
                }
                MI.Phone.Notifications.Timeout = setTimeout(function(){
                    MI.Phone.Animations.TopSlideUp(".phone-notification-container", 200, -8);
                    MI.Phone.Notifications.Timeout = null;
                }, timeout);
            }
        }
    });
}

MI.Phone.Functions.LoadPhoneData = function(data) {
    MI.Phone.Data.PlayerData = data.PlayerData;
    MI.Phone.Data.PlayerJob = data.PlayerJob;
    MI.Phone.Data.MetaData = data.PhoneData.MetaData;
    
    MI.Phone.Functions.LoadMetaData(data.PhoneData.MetaData);
    MI.Phone.Functions.LoadContacts(data.PhoneData.Contacts);
    MI.Phone.Functions.SetupApplications(data);
    // console.log("Phone succesfully loaded!");

    $.post('http://s4-phone/GetLangData', JSON.stringify({}), function(langs){
        MI.Phone.LangData = langs.table[langs.current];
    });
}

MI.Phone.Functions.Lang = function(item) {    
    if (MI.Phone.LangData[item]) {
        return MI.Phone.LangData[item];
    } else {
        return item;
    }
}

MI.Phone.Functions.UpdateTime = function(data) {    
    var NewDate = new Date();
    var NewHour = NewDate.getHours();
    var NewMinute = NewDate.getMinutes();
    var Minutessss = NewMinute;
    var Hourssssss = NewHour;
    if (NewHour < 10) {
        Hourssssss = "0" + Hourssssss;
    }
    if (NewMinute < 10) {
        Minutessss = "0" + NewMinute;
    }
    var MessageTime = Hourssssss + ":" + Minutessss

    $("#phone-time").html(MessageTime);
}

var NotificationTimeout = null;

MI.Screen.Notification = function(title, content, icon, timeout, color) {
    $.post('http://s4-phone/HasPhone', JSON.stringify({}), function(HasPhone){
        if (HasPhone) {
            if (color != null && color != undefined) {
                $(".screen-notifications-container").css({"background-color":color});
            }
            $(".screen-notification-icon").html('<i class="'+icon+'"></i>');
            $(".screen-notification-title").text(title);
            $(".screen-notification-content").text(content);
            $(".screen-notifications-container").css({'display':'block'}).animate({
                right: 5+"vh",
            }, 200);
        
            if (NotificationTimeout != null) {
                clearTimeout(NotificationTimeout);
            }
        
            NotificationTimeout = setTimeout(function(){
                $(".screen-notifications-container").animate({
                    right: -35+"vh",
                }, 200, function(){
                    $(".screen-notifications-container").css({'display':'none'});
                });
                NotificationTimeout = null;
            }, timeout);
        }
    });
}


 


$(document).ready(function(){
    $( "*" ).on("input", function(){
        $.post('http://s4-phone/disableControls', JSON.stringify({}))
    });

    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "open":
                MI.Phone.Functions.Open(event.data);
                MI.Phone.Functions.SetupAppWarnings(event.data.AppData);
                MI.Phone.Functions.SetupCurrentCall(event.data.CallData);
                MI.Phone.Data.IsOpen = true;
                MI.Phone.Data.PlayerData = event.data.PlayerData;
				MI.Phone.Data.s4meta = event.data.s4meta;
				metaSetup(MI.Phone.Data);
				$("#bmrkt").css("display","none");
                break;
			case "close":
			    MI.Phone.Functions.Close();
				break;
			case "DosyaAl":
			    $(".s4SHRGELD").css("display", "block");
				$(".s4SHRGELDtext").html(`<strong>${event.data.veri.firstname} ${event.data.veri.lastname}</strong> tarafından bir adet resim gönderildi.`);
			    break;
			case "bm":
			 if(event.data.state == 1) {
			    $("#bmrkt").css("display","unset");
			 } else {
				$("#bmrkt").css("display","none");
				$("#wifikp").css("display","none");
			    $("#bmrkt").css("display","none");
			 }
				break;
            case "darkwebForceClose":
                MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
                CanOpenApp = false;
                setTimeout(function(){
                    MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, "none");
                    CanOpenApp = true;
                }, 400)
                MI.Phone.Functions.HeaderTextColor("white", 300);
                MI.Phone.Data.currentApplication = null;
                break;
            case "LoadPhoneData":
                MI.Phone.Functions.LoadPhoneData(event.data);
                break;
            case "UpdateTime":
                MI.Phone.Functions.UpdateTime(event.data);
                break;
            case "updateTest":
                MI.Phone.Notifications.LoadSelfTweets(event.data.selfTweets)
                break;
            case "updateTweets":
                MI.Phone.Notifications.LoadTweets(event.data.tweets)
                MI.Phone.Notifications.LoadSelfTweets(event.data.selfTweets)
                break;
			case "TamEkranKapat":
			    ekran(0);
			    break;
			case "TamEkranGecis":
			    ekran(1);
			    break;
			case "BildirimManager":
			    BildirimManager(event.data.bildirim);
			    break;
            case "Notification":
                MI.Screen.Notification(event.data.NotifyData.title, event.data.NotifyData.content, event.data.NotifyData.icon, event.data.NotifyData.timeout, event.data.NotifyData.color);
                break;
            case "PhoneNotification":
                MI.Phone.Notifications.Add(event.data.PhoneNotify.icon, event.data.PhoneNotify.title, event.data.PhoneNotify.text, event.data.PhoneNotify.color, event.data.PhoneNotify.timeout);
                break;
            case "RefreshAppAlerts":
                MI.Phone.Functions.SetupAppWarnings(event.data.AppData);                
                break;
            case "UpdateMentionedTweets":
                MI.Phone.Notifications.LoadMentionedTweets(event.data.Tweets);                
                break;
            case "UpdateBank":
                $(".bank-app-account-balance").html("&euro; "+event.data.NewBalance);
                $(".bank-app-account-balance").data('balance', event.data.NewBalance);
                break;
            case "UpdateChat":
                if (MI.Phone.Data.currentApplication == "whatsapp") {
                    if (OpenedChatData.number !== null && OpenedChatData.number == event.data.chatNumber) {
                        // console.log('Chat reloaded')
                        MI.Phone.Functions.SetupChatMessages(event.data.chatData);
                    } else {
                        // console.log('Chats reloaded')
                        MI.Phone.Functions.LoadWhatsappChats(event.data.Chats);
                    }
                }
                break;
            case "UpdateHashtags":
                MI.Phone.Notifications.LoadHashtags(event.data.Hashtags);
                break;
            case "RefreshWhatsappAlerts":
                MI.Phone.Functions.ReloadWhatsappAlerts(event.data.Chats);
                break;
            case "CancelOutgoingCall":
                $.post('http://s4-phone/HasPhone', JSON.stringify({}), function(HasPhone){
                    if (HasPhone) {
                        CancelOutgoingCall();
                    }
                });
                break;
            case "IncomingCallAlert":
                $.post('http://s4-phone/HasPhone', JSON.stringify({}), function(HasPhone){
                    if (HasPhone) {
                        IncomingCallAlert(event.data.CallData, event.data.Canceled, event.data.AnonymousCall);
                    }
                });
                break;
            case "SetupHomeCall":
                MI.Phone.Functions.SetupCurrentCall(event.data.CallData);
                break;
            case "AnswerCall":
                MI.Phone.Functions.AnswerCall(event.data.CallData);
                break;
            case "UpdateCallTime":
                var CallTime = event.data.Time;
                var date = new Date(null);
                date.setSeconds(CallTime);
                var timeString = date.toISOString().substr(11, 8);

                if (!MI.Phone.Data.IsOpen) {
                    if ($(".call-notifications").css("right") !== "52.1px") {
                        $(".call-notifications").css({"display":"block"});
                        $(".call-notifications").animate({right: 5+"vh"});
                    }
                    $(".call-notifications-title").html("Süren arama ("+timeString+")");
                    $(".call-notifications-content").html("Şu kişiyle "+event.data.Name);
                    $(".call-notifications").removeClass('call-notifications-shake');
                } else {
                    $(".call-notifications").animate({
                        right: -35+"vh"
                    }, 400, function(){
                        $(".call-notifications").css({"display":"none"});
                    });
                }

                $(".phone-call-ongoing-time").html(timeString);
                $(".phone-currentcall-title").html("In gesprek ("+timeString+")");
                break;
            case "CancelOngoingCall":
                $(".call-notifications").animate({right: -35+"vh"}, function(){
                    $(".call-notifications").css({"display":"none"});
                });
                MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                setTimeout(function(){
                    MI.Phone.Functions.ToggleApp("phone-call", "none");
                    $(".phone-application-container").css({"display":"none"});
                }, 400)
                MI.Phone.Functions.HeaderTextColor("white", 300);
    
                MI.Phone.Data.CallActive = false;
                MI.Phone.Data.currentApplication = null;
                break;
            case "RefreshContacts":
                MI.Phone.Functions.LoadContacts(event.data.Contacts);
                break;
            case "UpdateMails":
                MI.Phone.Functions.SetupMails(event.data.Mails);
                break;
            case "RefreshAdverts":
                if (MI.Phone.Data.currentApplication == "advert") {
                    MI.Phone.Functions.RefreshAdverts(event.data.Adverts);
                }
                break;
            case "AddPoliceAlert":
                AddPoliceAlert(event.data)
                break;
            case "UpdateApplications":
                MI.Phone.Data.PlayerJob = event.data.JobData;
                MI.Phone.Functions.SetupApplications(event.data);
                break;
            case "UpdateTransactions":
                RefreshCryptoTransactions(event.data);
                break;
            case "UpdateRacingApp":
                $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
                    SetupRaces(Races);
                });
                break;
        }
    })
	

});

$(document).on('keydown', function() {
    switch(event.keyCode) {
        case 27: // ESCAPE
            MI.Phone.Functions.Close();
			ekran(0);
            break;
		case 112:
		    MI.Phone.Functions.Close();
			ekran(0);
            break;
    }
});




var acik = false;



//$(".phone-application").css({"transition":"1s" });
 $('body').each(function() {

var timeout, longtouch;


$(this).mousedown(function() {
    timeout = setTimeout(function() {
        longtouch = true;
    }, 1500);
}).mouseup(function() {
	
    if (longtouch) {
   
if(acik == false){
  
	//  $(".phone-application").css({"zoom":"90%","left":"1.5vh"});
	//  $(".phone-footer-applications").css({"display":"none" });
	//  $(".phone-footer-applications2").css({"display":"block" });
	// $('.phone-home-applications').attr('id', 'sortable');
	    
	acik = true;
      }else {
	//	$(".phone-footer-applications").css({"display":"block" });
     //   $(".phone-application").css({"zoom":"unset","left":"0vh"});
	//	$(".phone-footer-applications2").css({"display":"none" });
		
		
		 
		//  $('.phone-home-applications').removeAttr('id');
        acik = false;
		
	
 
      }
     
    } else {
        // alert('short touch');


    }
	
	 
 
    longtouch = false;
	
	
    clearTimeout(timeout);
});

});






function fotograf_cek(){
 
	$.post('http://s4-phone/PostNewImage', JSON.stringify({}),
        function (url) {
			$(".cekilen_foto").css({"display":"block"});
			$(".foto").css({"background":"url("+url+")", "background-size":"cover", "background-position":"center" });
            $('#foto_url').val(url);
        },
    );
	
	 MI.Phone.Functions.Close();
}


function kaydet() {
	var resim = $('#foto_url').val();
	$.post("http://s4-phone/FotoGaleriKayit", JSON.stringify({ resim_url: resim   })); 
	$(".cekilen_foto").css({"display":"none"});
	
	MI.Phone.Notifications.Add("fas fa-check-circle", "Galeri", " Fotoğraf kaydedildi." )
   
}

function iptal(){
	$(".cekilen_foto").css({"display":"none"});
}



function ekran(x) {
	
	
	if(x == 0) {
// ADD
// bottom: 0%;		
		
//REMOVE		
//	left: 0%;
//   transform: rotate( -90deg );
//    zoom: 200%;

donmus = false;
$(".d_1").css({"display":"unset" });
$(".d_2").css({"display":"none" });
$(".container").css({"bottom":"0%","left":"","transform":"", "zoom":""  });

 //$(".container").removeClass("ekrandondur");
 
   //     $("#photoShow").css({"width":"100%", "height": "475px", "transform":"","top":"0","left":""   });
	//    $(".phone-application").css({"transform":"","margin-left":""	});
	//	$(".dondurulebilir").css({"transform":"" 	});
	}
 
	
	if(x == 1) {
$(".d_1").css({"display":"none" });
$(".d_2").css({"display":"unset"   });		
	//$(".container").css({"top":"46vh","left":"-10vh","transform":"rotate( -90deg )", "zoom":"200%", "bottom":""  });
	
	//$(".container").addClass("ekrandondur");
//	$("#photoShow").css({"width":"500px", "height": "300px", "transform":"rotate(90deg)","top":"70px","left":"-45px"   });
	//$(".phone-application").css({"transform":"rotate(90deg)","margin-left":"10px"	});
	//$(".dondurulebilir").css({"transform":"rotate(90deg)" 	});
// REMOVE
// bottom: 0%;
	
/// ADD
//	left: 0%;
//    transform: rotate( -90deg );
//   zoom: 200%;	

donmus = true;
	}
	
	
	
}

function fener(x) {
	
 if(x == 0) {
 

$(".ff_1").css({"display":"unset" });
$(".ff_2").css({"display":"none" });
 	$.post("http://s4-phone/Fener", JSON.stringify({ fener: "kapali"   })); 
	}
	
	if(x == 1) {
$(".ff_1").css({"display":"none" });
$(".ff_2").css({"display":"unset"   });		
  	$.post("http://s4-phone/Fener", JSON.stringify({ fener: "acik"   })); 
	}
	
	
	
}

document.addEventListener('swiped', function(e) {
    console.log(e.target); // the element that was swiped
    console.log(e.detail.dir); // swiped direction
});

function ustbar(){
	console.log("ustbar");
}


function BildirimManager(bildirim){
	
	if(bildirim.durum == "acik" ) {
	   $("#"+bildirim.tip+"_b").css("display","block");
	}else {
	   $("#"+bildirim.tip+"_b").css("display","none");
	}
	
	$("#"+bildirim.tip+"_uyg_metni").val(bildirim.title);
	 
	console.log(bildirim);
}
 
 
 function havaguncelle(){
	                     $.post('http://s4-phone/GetHavaDurumu', JSON.stringify({}), function(data){
 
                        MI.Phone.Functions.DoHavaDurumuOpen(data);
                    });	
 }
 
 
   $( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
	 $( "#sortable2" ).sortable();
    $( "#sortable2" ).disableSelection();
  } );
  
  
  
  
  
$( "#ustbar" ).click(function() {
    ac_status();
});

function kapat_status(){

$(".notifbar").height(0);
document.getElementsByClassName("notifbar")[0].style.top = "-200px";

setTimeout(function() {    $(".notifbar").css("display", "none");   }, 1000);

}

function ac_status(){
    $(".notifbar").css("display", "block"); 


setTimeout(function() { $(".notifbar").height(520);
document.getElementsByClassName("notifbar")[0].style.top = "0px";    }, 100);

}

 
 
 
 


function guncelleParlak(x) {
	var renk = 1.0;
	
	var renk2 = renk + (x/300);
	
	$(".container").css("filter","brightness("+  renk2  +")");
}



function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}



function metaSetup(x) {
	 
	
if(x.s4meta.durum ==  "kilitli") {
	if(x.s4meta.id != x.PlayerData.citizenid){ $(".kilitli").css("display","block"); }
}else {
	  $(".kilitli").css("display","none");
}

if(x.s4meta.id == x.PlayerData.citizenid) {
   
  $(".mmm").css("display","unset");
   
}else {
   $(".mmm").css("display","none");
 
}

}
/// APP JS BITIS

/// SETTINGS

MI.Phone.Settings = {};
MI.Phone.Settings.Background = "background-1";
MI.Phone.Settings.OpenedTab = null;
MI.Phone.Settings.Backgrounds = {
    'background-1': {
        label: "Standard"
    }
};

var PressedBackground = null;
var PressedBackgroundObject = null;
var OldBackground = null;
var IsChecked = null;

$(document).on('click', '.settings-app-tab', function(e){
    e.preventDefault();
    var PressedTab = $(this).data("settingstab");

    if (PressedTab == "arkaplan") {
        MI.Phone.Animations.TopSlideDown(".settings-"+PressedTab+"-tab", 200, 0);
        MI.Phone.Settings.OpenedTab = PressedTab;
		$(".arkaplan_ayarlari").css("display", "block");
		
    } else if (PressedTab == "profilepicture") {
        MI.Phone.Animations.TopSlideDown(".settings-"+PressedTab+"-tab", 200, 0);
        MI.Phone.Settings.OpenedTab = PressedTab;
    } else if (PressedTab == "numberrecognition") {
        var checkBoxes = $(".numberrec-box");
        MI.Phone.Data.AnonymousCall = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.AnonymousCall);

        if (!MI.Phone.Data.AnonymousCall) {
            $("#numberrecognition > p").html('Closed');
        } else {
            $("#numberrecognition > p").html('Open');
        }
    } else if (PressedTab == "available") {
        var checkBoxes = $(".available-box");
        MI.Phone.Data.AnonymousCall = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.AnonymousCall);
        var a = "Uçak modu kapatıldı"
        var b = false
        if ($("#available > p").html() == "Açık") {
            $("#available > p").html('Kapalı');
        } else {
            $("#available > p").html('Açık');
            a = "Uçak modu açıldı"
            b = true
        }
        $.post("http://s4-phone/UpdateAvailableStatus", JSON.stringify({available: b}),
            function () {
                MI.Phone.Notifications.Add("fas fa-cog", MI.Phone.Functions.Lang("SETTINGS_TITLE"), a)
            }
        );
    } else if (PressedTab == "bluetooth") {
        var checkBoxes = $(".bluetooth-box");
        MI.Phone.Data.Bt = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.Bt);
        var a = "S4 SHARE kapatıldı"
        var b = false
        if (MI.Phone.Data.Bt == false) {
            a = "S4 SHARE kapatıldı"
			b = false
        } else {
            a = "S4 SHARE açıldı"
            b = true
        }
		$.post("http://s4-phone/s4share", JSON.stringify({veri: b}),
            function () {
                MI.Phone.Notifications.Add("fas fa-cog", MI.Phone.Functions.Lang("SETTINGS_TITLE"), a)
            }
        );
         
    } else if (PressedTab == "darkmode") {
        var checkBoxes = $(".darkmode-box");
        MI.Phone.Data.Darkmode = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.Darkmode);
        var a = "Karanlık mod kapatıldı"
        var b = false
        if ($("#darkmode > p").html() == "Açık") {
            $("#darkmode > p").html('Kapalı');
        } else {
            $("#darkmode > p").html('Açık');
            a = "Karanlık mod açıldı"
            b = true
        }
        MI.Phone.Notifications.Add("fas fa-cog", MI.Phone.Functions.Lang("SETTINGS_TITLE"), a)
        SettingsDarkmode();
    } else if (PressedTab == "sound") {
        var checkBoxes = $(".sound-box");
        MI.Phone.Data.Sound = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.Sound);
        var a = "Zil sesleri kapatıldı"
        var b = false
        if ($("#sound > p").html() == "Açık") {
            $("#sound > p").html('Kapalı');
        } else {
            $("#sound > p").html('Açık');
            a = "Zil sesleri açıldı"
            b = true
        }
        $.post("http://s4-phone/UpdateSoundStatus", JSON.stringify({sound: b}),
            function () {
                MI.Phone.Notifications.Add("fas fa-cog", MI.Phone.Functions.Lang("SETTINGS_TITLE"), a)
            }
        );
	} else if (PressedTab == "wifi") {
		$(".wifi_ayarlari").css("display", "block");
    } else if (PressedTab == "widget") {
        $(".widget_ayarlari").css("display", "block");
    } else if (PressedTab == "widget_gorunum") {
		
        var checkBoxes = $(".widget_gorunum-box");
        MI.Phone.Data.widget_gorunum = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.widget_gorunum);
		
		if(MI.Phone.Data.widget_gorunum == true){
			
			if( MI.Phone.Data.widget_tip == "w1"){
				$(".havadurumu-widget").css("display", "block");	
				$(".takvim-widget").css("display", "none");	
				}else {
				$(".havadurumu-widget").css("display", "none");
				$(".takvim-widget").css("display", "block");	
			}
		     	
				//$(".phone-home-applications").css("top", "22vh");
				//$(".phone-footer-applications").css("margin-bottom", "55%");
				
		}else {
			
		   $(".havadurumu-widget").css("display", "none");	
 
	       $(".takvim-widget").css("display", "none");	
	       
		//   $(".phone-home-applications").css("top", "8vh");
		//   $(".phone-footer-applications").css("margin-bottom", "50%");
		}
 
    } else if (PressedTab == "widget_konum") {
		
        var checkBoxes = $(".widget_konum-box");
        MI.Phone.Data.widget_konum = !checkBoxes.prop("checked");
        checkBoxes.prop("checked", MI.Phone.Data.widget_konum);
 
    } 

});


ListeleBT = function(Hesaplar) {
 
 $(".oyuncu_listesi").html("");	
    if (Hesaplar != null) {
        $.each(Hesaplar, function(id, hesap){
 
            var Element = `
 

<tr>
    <th><input type="text"  value="${hesap.user}" disabled /></th>
    
    <th><a href="javascript:gonderBT('${hesap.id}')" id="ah_${hesap.id}" class="takipbtn" >Paylaş</a></th>
</tr>
			
			`;
			
		
		if(hesap.citizenid != 	MI.Phone.Data.PlayerData.citizenid) { $(".oyuncu_listesi").append(Element);   }
        });
    }
}
var simdiki_id = null;
function gonderBT(id){
	$("#ah_"+id).attr("href", "#");
    $("#ah_"+id).html(`<i class="fas fa-circle-notch fa-spin"></i>`);
 
	MI.Phone.Notifications.Add("fab fa-bluetooth-b", "S4 SHARE", "Gönderiliyor...")
	
	$.post('http://s4-phone/DosyaGonder', JSON.stringify({
        src: id, resim_url: simdiki_id
    }));
   
}

function btgelenkayit() {
	$.post('http://s4-phone/DosyaKaydet', JSON.stringify({ durum: "kaydet" }));
	$(".s4SHRGELD").css("display", "none");
}
function btgeleniptal() {
	$.post('http://s4-phone/DosyaKaydet', JSON.stringify({ durum: "none" }));
	$(".s4SHRGELD").css("display", "none");
}

$(document).on('click', '.wget', function(e){
    e.preventDefault();
    var baslian = $(this).data("widget");
	MI.Phone.Notifications.Add("fas fa-cog", "Widget", "Seçtiğiniz widget ayarlandı.")
   
   
  if(MI.Phone.Data.widget_gorunum == true){
  
   if(baslian == "w1"){
	    $(".havadurumu-widget").css("display", "block");
	    $(".takvim-widget").css("display", "none");
   }else if(baslian == "w2"){
	   	$(".havadurumu-widget").css("display", "none");
	    $(".takvim-widget").css("display", "block");
   }
 
 MI.Phone.Data.widget_tip = baslian;
  }
 
 

});


function wifiac(){
	
	
	$.post('http://s4-phone/WifiSifreKontrol', JSON.stringify({ sifre: $(".wifin").val()  }), function(veri){
               
        if(veri == $(".wifin").val()) {
			MI.Phone.Notifications.Add("fas fa-wifi", "Wifi", "Connected.")
			$("#wifikp").css("display","block");
		}else {
			MI.Phone.Notifications.Add("fas fa-wifi", "Wifi", "Wrong password.")
			$("#wifikp").css("display","none");
			$("#bmrkt").css("display","none");
		}
		
     });
 
} 

function wifikp(){
	
	
	$.post('http://s4-phone/WifiSifreKontrol', JSON.stringify({ sifre: "asdasdasdsasadas"  }), function(veri){
 
			$("#wifikp").css("display","none");
			$("#bmrkt").css("display","none");
		 
		
     });
 
} 

function kapatwd(){ $(".wifi_ayarlari").css("display", "none"); $(".widget_ayarlari").css("display", "none"); $(".arkaplan_ayarlari").css("display", "none");}

SettingsDarkmode = function() {
    if (MI.Phone.Data.Darkmode) {
        //Settings
        $(".settings-app").css({"background": "#1f1f1f"});
        $(".settings-tab-description").css({"color": "rgb(230, 230, 230)"});
        $(".settings-tab-title").css({"color": "rgb(230, 230, 230)"});
        $(".settings-app-tab-header").css({"color": "rgb(230, 230, 230)"});
        $(".settings-app-header").css({"color": "rgb(230, 230, 230)"});
        $(".settings-tab-icon").css({"color": "white"});
        //Advert
		$(".settings-app-tab").css({"background": "black"});
        $(".advert-app").css({"background": "#1f1f1f"});
        $(".advert-list").css({"background-color": "#1f1f1f", "box-shadow": "0px 0 1px .5px rgba(255, 255, 255, 0.233)"});
        $("#advert-header-text").css({"color": "white"});
        $("#advert-header-name").css({"color": "white"});
        $(".test-slet").css({"background-color": "#1f1f1f", "color": "white"});
        //Whatsapp
        $(".whatsapp-app").css({"background-image": "url('https://cdn.discordapp.com/attachments/692089489186750627/836900693503508480/97c00759d90d786d9b6096d274ad3e07.png')"});
        $(".whatsapp-openedchat").css({"background-image": "url('https://cdn.discordapp.com/attachments/692089489186750627/836900693503508480/97c00759d90d786d9b6096d274ad3e07.png')"});
        //Mail
        $(".mail-header").css({"background-color": "#1f1f1f"});
        $("#mail-header-text").css({"color": "white"});
        $(".mail").css({"background-color": "#1f1f1f"});
        $(".mail-list").css({"background-color": "#1f1f1f"});
        $(".opened-mail").css({"background": "#1f1f1f"});
        $(".opened-mail-footer").css({"background-color": "#1f1f1f", "color": "white"});
        $(".opened-mail-footer-item").css({"color": "white"});
        $(".mail-back").css({"color": "white"});
        $(".mail-content").css({"color": "white"});
        $(".mail-date").css({"color": "white"});
        $(".mail-sender").css({"color": "white"});
        $(".mail-text").css({"color": "white"});
        $(".mail-time").css({"color": "white"});
        $(".mail-image-media").css({"color": "white"});
        $("#mail-header-text").css({"color": "white"});
        $("#mail-header-mail").css({"color": "white"});
        $("#mail-header-lastsync").css({"color": "white"});
        $(".mail-subject").css({"color": "white"});
        $(".nomails").css({"color": "white"});
        //Phone
        $(".phone-app").css({"background": "#1f1f1f"});
        $(".phone-keypad").css({"background": "#1f1f1f"});
        $(".phone-recent").css({"background": "#1f1f1f"});
        $(".phone-add-contact").css({"background": "#1f1f1f"});
        $(".phone-add-contact-header").css({"color": "white"});
        $(".phone-add-contact-button").css({"color": "white"});
        $("#phone-search-icon").css({"color": "white"});
        $("#phone-plus-icon").css({"color": "white"});
        $("#phone-add-contact-name-icon").css({"color": "white"});
        $("#phone-add-contact-number-icon").css({"color": "white"});
        $("#phone-add-contact-iban-icon").css({"color": "white"});
        $(".phone-add-contact-name").css({"color": "white"});
        $(".phone-add-contact-number").css({"color": "white"});
        $(".phone-add-contact-iban").css({"color": "white"});
        $(".phone-edit-contact").css({"background": "#1f1f1f"});
        $(".phone-edit-contact-button").css({"color": "white"});
        $(".phone-edit-contact-header").css({"color": "white"});
        $(".phone-suggestedcontacts").css({"background": "#1f1f1f"});
        $(".phone-suggestedcontacts-header").css({"color": "white"});
        $(".phone-app-footer-button").css({"color": "white"});
        $(".phone-keypad-key").css({"color": "white"});
        $(".phone-keypad-header").css({"color": "white"});
        $(".phone-recent-header").css({"color": "white"});
        $(".phone-app-header").css({"color": "white"});
        $("#total-contacts").css({"color": "white"});
        $(".phone-contact").css({"background-color": "#1f1f1f", "border":".1vh solid rgba(206, 206, 206, 0.2)"});
        $(".phone-contact-action-buttons > i").css({"color": "white"});
        $("#phone-edit-contact-name-icon").css({"color": "white"});
        $("#phone-edit-contact-number-icon").css({"color": "white"});
        $("#phone-edit-contact-iban-icon").css({"color": "white"});
        $(".phone-edit-contact-name").css({"color": "white"});
        $(".phone-edit-contact-number").css({"color": "white"});
        $(".phone-edit-contact-iban").css({"color": "white"});
        $(".phone-contact-name").css({"color": "white"});
        $("#phone-keypad-input").css({"color": "white", "box-shadow": "inset 0 0 .5vh 0 rgba(255, 255, 255, 0.171"});
        //Other apps(one div)
        $(".mecano-app").css({"background": "#1f1f1f"});
        $(".polices-app").css({"background": "#1f1f1f"});
        $(".doctor-app").css({"background": "#1f1f1f"});
        $(".lawyers-app").css({"background": "#1f1f1f"});
        $(".arrests-app").css({"background": "#1f1f1f"});
        $(".weazel-app").css({"background": "#1f1f1f"});
        $(".food-app").css({"background": "#1f1f1f"});
    } else {
        //Settings
		$(".settings-app-tab").css({"background": "white"});
        $(".settings-app").css({"background": "#f0eff4"});
        $(".settings-tab-description").css({"color": "rgba(0, 0, 0, 0.65)"});
        $(".settings-tab-title").css({"color": "#333"});
        $(".settings-app-header").css({"color": "#333"});
        $(".settings-tab-icon").css({"color": "#333"});
        //Advert
        $(".advert-app").css({"background": "#f2f2f2"});
        $(".advert-list").css({"background-color": "rgb(255, 255, 255)", "box-shadow": "0px 0 1px .5px rgba(0, 0, 0, 0.233)"});
        $("#advert-header-text").css({"color": "black"});
        $("#advert-header-name").css({"color": "black"});
        $(".test-slet").css({"background-color": "rgb(234, 234, 234)", "color": "black"});
        //Whatsapp
        $(".whatsapp-app").css({"background-image": "url('./img/apps/whatsapp-chat.png')"});
        $(".whatsapp-openedchat").css({"background-image": "url('./img/apps/whatsapp-chat.png')"});
        //Mail
        $(".mail-header").css({"background-color": "#f2f2f2"});
        $("#mail-header-text").css({"color": "white"});
        $(".mail").css({"background-color": "#f2f2f2"});
        $(".mail-list").css({"background-color": "#f2f2f2"});
        $(".opened-mail").css({"background": "#f2f2f2"});
        $(".opened-mail-footer").css({"background-color": "#f2f2f2", "color": "white"});
        $(".opened-mail-footer-item").css({"color": "rgb(24, 24, 24)"});
        $(".mail-back").css({"color": "rgb(24, 24, 24)"});
        $(".mail-content").css({"color": "rgb(24, 24, 24)"});
        $(".mail-date").css({"color": "rgb(24, 24, 24)"});
        $(".mail-sender").css({"color": "rgb(24, 24, 24)"});
        $(".mail-text").css({"color": "rgb(24, 24, 24)"});
        $(".mail-time").css({"color": "rgb(24, 24, 24)"});
        $(".mail-image-media").css({"color": "rgb(24, 24, 24)"});
        $("#mail-header-text").css({"color": "rgb(24, 24, 24)"});
        $("#mail-header-mail").css({"color": "rgb(24, 24, 24)"});
        $("#mail-header-lastsync").css({"color": "rgb(24, 24, 24)"});
        $(".mail-subject").css({"color": "rgb(24, 24, 24)"});
        $(".nomails").css({"color": "black"});
        //Phone
        $(".phone-app").css({"background": "rgb(230, 230, 230)"});
        $(".phone-keypad").css({"background": "rgb(230, 230, 230)"});
        $(".phone-recent").css({"background": "rgb(230, 230, 230)"});
        $(".phone-add-contact").css({"background": "rgb(230, 230, 230)"});
        $(".phone-add-contact-header").css({"color": "rgb(44,44,44)"});
        $(".phone-add-contact-button").css({"color": "rgb(44,44,44)"});
        $("#phone-search-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-plus-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-add-contact-name-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-add-contact-number-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-add-contact-iban-icon").css({"color": "rgb(44,44,44)"});
        $(".phone-add-contact-name").css({"color": "rgb(44,44,44)"});
        $(".phone-add-contact-number").css({"color": "rgb(44,44,44)"});
        $(".phone-add-contact-iban").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact").css({"background": "rgb(230, 230, 230)"});
        $(".phone-edit-contact-button").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact-header").css({"color": "rgb(44,44,44)"});
        $(".phone-suggestedcontacts").css({"background": "rgb(230, 230, 230)"});
        $(".phone-suggestedcontacts-header").css({"color": "rgb(44,44,44)"});
        $(".phone-app-footer-button").css({"color": "rgb(44,44,44)"});
        $(".phone-keypad-key").css({"color": "rgb(44,44,44)"});
        $(".phone-keypad-header").css({"color": "rgb(44,44,44)"});
        $(".phone-recent-header").css({"color": "rgb(44,44,44)"});
        $(".phone-app-header").css({"color": "rgb(44,44,44)"});
        $("#total-contacts").css({"color": "rgb(44,44,44)"});
        $(".phone-contact").css({"background-color": "rgb(240, 240, 240)", "border":".1vh solid rgb(206, 206, 206)"});
        $(".phone-contact-action-buttons > i").css({"color": "rgb(44,44,44)"});
        $("#phone-edit-contact-name-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-edit-contact-number-icon").css({"color": "rgb(44,44,44)"});
        $("#phone-edit-contact-iban-icon").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact-name").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact-number").css({"color": "rgb(44,44,44)"});
        $(".phone-edit-contact-iban").css({"color": "rgb(44,44,44)"});
        $(".phone-contact-name").css({"color": "rgb(44,44,44)"});
        $("#phone-keypad-input").css({"color": "rgb(44,44,44)", "box-shadow": "inset 0 0 .5vh 0 rgba(0, 0, 0, 0.171)"});
        //Other apps(one div)
        $(".mecano-app").css({"background": "rgb(248, 248, 248)"});
        $(".polices-app").css({"background": "rgb(248, 248, 248)"});
        $(".doctor-app").css({"background": "rgb(248, 248, 248)"});
        $(".lawyers-app").css({"background": "rgb(248, 248, 248)"});
        $(".arrests-app").css({"background": "rgb(248, 248, 248)"});
        $(".weazel-app").css({"background": "rgb(248, 248, 248)"});
        $(".food-app").css({"background": "rgb(248, 248, 248)"});
    }
}

$(document).on('click', '#accept-background', function(e){
    e.preventDefault();
    var hasCustomBackground = MI.Phone.Functions.IsBackgroundCustom();

    if (hasCustomBackground === false) {
        MI.Phone.Notifications.Add("fas fa-paint-brush", MI.Phone.Functions.Lang("SETTINGS_TITLE"), MI.Phone.Settings.Backgrounds[MI.Phone.Settings.Background].label+" is ingesteld!")
        MI.Phone.Animations.TopSlideUp(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $(".phone-background").css({"background-image":"url('/html/img/backgrounds/"+MI.Phone.Settings.Background+".png')"})
    } else {
        MI.Phone.Notifications.Add("fas fa-paint-brush", MI.Phone.Functions.Lang("SETTINGS_TITLE"), MI.Phone.Functions.Lang("BACKGROUND_SET"))
        MI.Phone.Animations.TopSlideUp(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $(".phone-background").css({"background-image":"url('"+MI.Phone.Settings.Background+"')"});
    }


});

MI.Phone.Functions.LoadMetaData = function(MetaData) {
    if (MetaData.background !== null && MetaData.background !== undefined) {
        MI.Phone.Settings.Background = MetaData.background;
    } else {
        MI.Phone.Settings.Background = "background-1";
    }

    // console.log(JSON.stringify(MetaData));

    var hasCustomBackground = MI.Phone.Functions.IsBackgroundCustom();

    if (!hasCustomBackground) {
        $(".phone-background").css({"background-image":"url('/html/img/backgrounds/"+MI.Phone.Settings.Background+".png')"})
    } else {
        $(".phone-background").css({"background-image":"url('"+MI.Phone.Settings.Background+"')"});
    }

    if (MetaData.profilepicture == "default") {
        $("[data-settingstab='profilepicture']").find('.settings-tab-icon').html('<img src="./img/default.png">');
    } else {
        $("[data-settingstab='profilepicture']").find('.settings-tab-icon').html('<img src="'+MetaData.profilepicture+'">');
    }
}

$(document).on('click', '#cancel-background', function(e){
    e.preventDefault();
    MI.Phone.Animations.TopSlideUp(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
});

MI.Phone.Functions.IsBackgroundCustom = function() {
    var retval = true;
    $.each(MI.Phone.Settings.Backgrounds, function(i, background){
        if (MI.Phone.Settings.Background == i) {
            retval = false;
        }
    });
    return retval
}

$(document).on('click', '.background-option', function(e){
    e.preventDefault();
    PressedBackground = $(this).data('background');
    PressedBackgroundObject = this;
    OldBackground = $(this).parent().find('.background-option-current');
    IsChecked = $(this).find('.background-option-current');

    if (IsChecked.length === 0) {
        if (PressedBackground != "custom-background") {
            MI.Phone.Settings.Background = PressedBackground;
            $(OldBackground).fadeOut(50, function(){
                $(OldBackground).remove();
            });
            $(PressedBackgroundObject).append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
        } else {
            MI.Phone.Animations.TopSlideDown(".background-custom", 200, 13);
        }
    }
});

$(document).on('click', '#accept-custom-background', function(e){
    e.preventDefault();

    MI.Phone.Settings.Background = $(".custom-background-input").val();
    $(OldBackground).fadeOut(50, function(){
        $(OldBackground).remove();
    });
    $(PressedBackgroundObject).append('<div class="background-option-current"><i class="fas fa-check-circle"></i></div>');
    MI.Phone.Animations.TopSlideUp(".background-custom", 200, -23);
});

$(document).on('click', '#cancel-custom-background', function(e){
    e.preventDefault();

    MI.Phone.Animations.TopSlideUp(".background-custom", 200, -23);
});

// Profile Picture

var PressedProfilePicture = null;
var PressedProfilePictureObject = null;
var OldProfilePicture = null;
var ProfilePictureIsChecked = null;

$(document).on('click', '#accept-profilepicture', function(e){
    e.preventDefault();
    var ProfilePicture = MI.Phone.Data.MetaData.profilepicture;
    if (ProfilePicture === "default") {
        MI.Phone.Notifications.Add("fas fa-paint-brush", MI.Phone.Functions.Lang("SETTINGS_TITLE"), MI.Phone.Functions.Lang("POFILE_DEFAULT"))
        MI.Phone.Animations.TopSlideUp(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
        $("[data-settingstab='profilepicture']").find('.settings-tab-icon').html('<img src="./img/default.png">');
    } else {
        MI.Phone.Notifications.Add("fas fa-paint-brush", MI.Phone.Functions.Lang("SETTINGS_TITLE"), MI.Phone.Functions.Lang("PROFILE_SET"))
        MI.Phone.Animations.TopSlideUp(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
        // console.log(ProfilePicture)
        $("[data-settingstab='profilepicture']").find('.settings-tab-icon').html('<img src="'+ProfilePicture+'">');
    }
    $.post('http://s4-phone/UpdateProfilePicture', JSON.stringify({
        profilepicture: ProfilePicture,
    }));
});

$(document).on('click', '#accept-custom-profilepicture', function(e){
    e.preventDefault();
    MI.Phone.Data.MetaData.profilepicture = $(".custom-profilepicture-input").val();
    $(OldProfilePicture).fadeOut(50, function(){
        $(OldProfilePicture).remove();
    });
    $(PressedProfilePictureObject).append('<div class="profilepicture-option-current"><i class="fas fa-check-circle"></i></div>');
    MI.Phone.Animations.TopSlideUp(".profilepicture-custom", 200, -23);
});

$(document).on('click', '.profilepicture-option', function(e){
    e.preventDefault();
    PressedProfilePicture = $(this).data('profilepicture');
    PressedProfilePictureObject = this;
    OldProfilePicture = $(this).parent().find('.profilepicture-option-current');
    ProfilePictureIsChecked = $(this).find('.profilepicture-option-current');
    if (ProfilePictureIsChecked.length === 0) {
        if (PressedProfilePicture != "custom-profilepicture") {
            MI.Phone.Data.MetaData.profilepicture = PressedProfilePicture
            $(OldProfilePicture).fadeOut(50, function(){
                $(OldProfilePicture).remove();
            });
            $(PressedProfilePictureObject).append('<div class="profilepicture-option-current"><i class="fas fa-check-circle"></i></div>');
        } else {
            MI.Phone.Animations.TopSlideDown(".profilepicture-custom", 200, 13);
        }
    }
});

$(document).on('click', '#cancel-profilepicture', function(e){
    e.preventDefault();
    MI.Phone.Animations.TopSlideUp(".settings-"+MI.Phone.Settings.OpenedTab+"-tab", 200, -100);
});


$(document).on('click', '#cancel-custom-profilepicture', function(e){
    e.preventDefault();
    MI.Phone.Animations.TopSlideUp(".profilepicture-custom", 200, -23);
});



 //   background-image: url(../img/backgrounds/background.gif);
 //   background-size: cover;
  //  background-position: -0.3vh 0.5vh;
  //  background-repeat: no-repeat;
function ark_ds(x){
	
     
	 
	 var backx = "../html/img/backgrounds/"+x+".png";
	 MI.Phone.Settings.Background = backx;
	 MI.Phone.Notifications.Add("fas fa-cog", "Ayarlar", "Arkaplan değiştirildi.");
	$(".phone-background").css({"background-image":"url("+backx+")","background-size":"cover","background-position":"-0.3vh 0.5vh","background-repeat":"no-repeat"   });
 
	$.post('http://s4-phone/SetBackground', JSON.stringify({
        background: MI.Phone.Settings.Background,
    }))
}



/// PHONE 
var ContactSearchActive = false;
var CurrentFooterTab = "contacts";
var CallData = {};
var ClearNumberTimer = null;
var SelectedSuggestion = null;
var AmountOfSuggestions = 0;

$(document).on('click', '.phone-app-footer-button', function(e){
    e.preventDefault();

    var PressedFooterTab = $(this).data('phonefootertab');

    if (PressedFooterTab !== CurrentFooterTab) {
        var PreviousTab = $(this).parent().find('[data-phonefootertab="'+CurrentFooterTab+'"');
		
 
 
 

        $(".phone-"+CurrentFooterTab).hide();
        $(".phone-"+PressedFooterTab).show();
		
		
		 
		  
		 $("."+CurrentFooterTab+"_1").hide();
		 $("."+CurrentFooterTab+"_0").show();
		 $("."+PressedFooterTab+"_1").show();
		 $("."+PressedFooterTab+"_0").hide();
		
 
        if (PressedFooterTab == "recent") {
            $.post('http://s4-phone/ClearRecentAlerts');
        } else if (PressedFooterTab == "suggestedcontacts") {
            $.post('http://s4-phone/ClearRecentAlerts');
        }
		
		
		kapat(PressedFooterTab, CurrentFooterTab);


        CurrentFooterTab = PressedFooterTab;
    }
});


function kapat(x, rec){



}

$(document).on("click", "#phone-search-icon", function(e){
    e.preventDefault();

    if (!ContactSearchActive) {
        $("#phone-plus-icon").animate({
            opacity: "0.0",
            "display": "none"
        }, 150, function(){
            $("#contact-search").css({"display":"block"}).animate({
                opacity: "1.0",
            }, 150);
        });
    } else {
        $("#contact-search").animate({
            opacity: "0.0"
        }, 150, function(){
            $("#contact-search").css({"display":"none"});
            $("#phone-plus-icon").animate({
                opacity: "1.0",
                display: "block",
            }, 150);
        });
    }

    ContactSearchActive = !ContactSearchActive;
});

MI.Phone.Functions.SetupRecentCalls = function(recentcalls) {
    $(".phone-recent-calls").html("");

    recentcalls = recentcalls.reverse();

    $.each(recentcalls, function(i, recentCall){
        var FirstLetter = (recentCall.name).charAt(0);
        var TypeIcon = 'fas fa-phone-slash';
        var IconStyle = "color: #e74c3c;";
        if (recentCall.type === "outgoing") {
            TypeIcon = 'fas fa-phone-volume';
            var IconStyle = "color: #2ecc71; font-size: 1.4vh;";
        }
        if (recentCall.anonymous) {
            FirstLetter = "A";
            recentCall.name = "Gizli Numara";
        }
        var elem = '<div class="phone-recent-call" id="recent-'+i+'"><div class="phone-recent-call-image">'+FirstLetter+'</div> <div class="phone-recent-call-name">'+recentCall.name+'</div> <div class="phone-recent-call-type"><i class="'+TypeIcon+'" style="'+IconStyle+'"></i></div> <div class="phone-recent-call-time">'+recentCall.time+'</div> </div>'

        $(".phone-recent-calls").append(elem);
        $("#recent-"+i).data('recentData', recentCall);
    });
}

$(document).on('click', '.phone-recent-call', function(e){
    e.preventDefault();

    var RecendId = $(this).attr('id');
    var RecentData = $("#"+RecendId).data('recentData');

    cData = {
        number: RecentData.number,
        name: RecentData.name
    }

    // console.log(MI.Phone.Data.AnonymousCall)

    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (!status.IsAvailable) {

                        
                            if (MI.Phone.Data.AnonymousCall) {
                                MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_STARTED_ANON"));
                            }
                            
                            // document.getElementById("outgoing-image").src = status.image
                            // document.getElementById("incall-image").src = status.image
                            $(".phone-call-outgoing").css({"display":"block"});
                            $(".phone-call-incoming").css({"display":"none"});
                            $(".phone-call-ongoing").css({"display":"none"});
                            $(".phone-call-outgoing-caller").html(cData.name);
                            MI.Phone.Functions.HeaderTextColor("white", 400);
                            MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                            setTimeout(function(){
                                $(".phone-app").css({"display":"none"});
                                MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                                MI.Phone.Functions.ToggleApp("phone-call", "block");
                            }, 450);
        
                            CallData.name = cData.name;
                            CallData.number = cData.number;
                        
                            MI.Phone.Data.currentApplication = "phone-call";    
                        } else {
                            MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), "Ulaşılamıyor!");
                        }
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                //MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});

$(document).on('click', ".phone-keypad-key-call", function(e){
    e.preventDefault();

    // var InputNum = toString($(".phone-keypad-input").text());
    var InputNum = document.getElementById("phone-keypad-input").innerHTML
    cData = {
        number: InputNum,
        name: InputNum,
    }

    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (!status.IsAvailable) {
                        
                            $(".phone-call-outgoing").css({"display":"block"});
                            $(".phone-call-incoming").css({"display":"none"});
                            $(".phone-call-ongoing").css({"display":"none"});
                            MI.Phone.Functions.HeaderTextColor("white", 400);
                            MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                            setTimeout(function(){
                                $(".phone-app").css({"display":"none"});
                                MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                                MI.Phone.Functions.ToggleApp("phone-call", "block");
                            }, 450);
        
                            CallData.name = cData.name;
                            CallData.number = cData.number;
                        
                            MI.Phone.Data.currentApplication = "phone-call";
                        } else {
                            MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), "Ulaşılamıyor!");
                        }
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                //MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});

MI.Phone.Functions.LoadContacts = function(myContacts) {
    var ContactsObject = $(".phone-contact-list");
    $(ContactsObject).html("");
    var TotalContacts = 0;

    $(".phone-contacts").hide();
    $(".phone-recent").hide();
    $(".phone-keypad").hide();

    $(".phone-"+CurrentFooterTab).show();

    $("#contact-search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".phone-contact-list .phone-contact").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    if (myContacts !== null) {
        $.each(myContacts, function(i, contact){
            var ContactElement = '<div class="phone-contact" data-contactid="'+i+'"><div class="phone-contact-firstletter" style="background-color: #e74c3c;">'+((contact.name).charAt(0)).toUpperCase()+'</div><div class="phone-contact-name">'+contact.name+'</div><div class="phone-contact-actions"><i class="fas fa-sort-down"></i></div><div class="phone-contact-action-buttons"> <i class="fas fa-phone-volume" id="phone-start-call"></i> <i class="fab fa-whatsapp" id="new-chat-phone" style="font-size: 2.5vh;"></i> <i class="fas fa-user-edit" id="edit-contact"></i> </div></div>'
            if (contact.status) {
                ContactElement = '<div class="phone-contact" data-contactid="'+i+'"><div class="phone-contact-firstletter" style="background-color: #2ecc71;">'+((contact.name).charAt(0)).toUpperCase()+'</div><div class="phone-contact-name">'+contact.name+'</div><div class="phone-contact-actions"><i class="fas fa-sort-down"></i></div><div class="phone-contact-action-buttons"> <i class="fas fa-phone-volume" id="phone-start-call"></i> <i class="fab fa-whatsapp" id="new-chat-phone" style="font-size: 2.5vh;"></i> <i class="fas fa-user-edit" id="edit-contact"></i> </div></div>'
            }
            TotalContacts = TotalContacts + 1
            $(ContactsObject).append(ContactElement);
            $("[data-contactid='"+i+"']").data('contactData', contact);
        });
        $("#total-contacts").text(TotalContacts+ " Kayıtlı kişi");
    } else {
        $("#total-contacts").text("Kayıtlı kimse yok");
    }
};

$(document).on('click', '#new-chat-phone', function(e){
    var ContactId = $(this).parent().parent().data('contactid');
    var ContactData = $("[data-contactid='"+ContactId+"']").data('contactData');

    if (ContactData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
        $.post('http://s4-phone/GetWhatsappChats', JSON.stringify({}), function(chats){
            MI.Phone.Functions.LoadWhatsappChats(chats);
        });
    
        $('.phone-application-container').animate({
            top: -160+"%"
        });
        MI.Phone.Functions.HeaderTextColor("white", 400);
        setTimeout(function(){
            $('.phone-application-container').animate({
                top: 0+"%"
            });
    
            MI.Phone.Functions.ToggleApp("phone", "none");
            MI.Phone.Functions.ToggleApp("whatsapp", "block");
            MI.Phone.Data.currentApplication = "whatsapp";
        
            $.post('http://s4-phone/GetWhatsappChat', JSON.stringify({phone: ContactData.number}), function(chat){
                MI.Phone.Functions.SetupChatMessages(chat, {
                    name: ContactData.name,
                    number: ContactData.number
                });
            });
        
            $('.whatsapp-openedchat-messages').animate({scrollTop: 9999}, 150);
            $(".whatsapp-openedchat").css({"display":"block"});
            $(".whatsapp-openedchat").css({left: 0+"vh"});
            $(".whatsapp-chats").animate({left: 30+"vh"},100, function(){
                $(".whatsapp-chats").css({"display":"none"});
            });
        }, 400)
    } else {
        MI.Phone.Notifications.Add("fas fa-sms", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_MSG_YOURSELF"));
    }
});

var CurrentEditContactData = {}

$(document).on('click', '#edit-contact', function(e){
    e.preventDefault();
    var ContactId = $(this).parent().parent().data('contactid');
    var ContactData = $("[data-contactid='"+ContactId+"']").data('contactData');

    CurrentEditContactData.name = ContactData.name
    CurrentEditContactData.number = ContactData.number

    $(".phone-edit-contact-header").text("Editing: " +ContactData.name)
    $(".phone-edit-contact-name").val(ContactData.name);
    $(".phone-edit-contact-number").val(ContactData.number);
    if (ContactData.iban != null && ContactData.iban != undefined) {
        $(".phone-edit-contact-iban").val(ContactData.iban);
        CurrentEditContactData.iban = ContactData.iban
    } else {
        $(".phone-edit-contact-iban").val("");
        CurrentEditContactData.iban = "";
    }

    MI.Phone.Animations.TopSlideDown(".phone-edit-contact", 200, 0);
});

$(document).on('click', '#edit-contact-save', function(e){
    e.preventDefault();

    var ContactName = $(".phone-edit-contact-name").val();
    var ContactNumber = $(".phone-edit-contact-number").val();
    var ContactIban = $(".phone-edit-contact-iban").val();

    if (ContactName != "" && ContactNumber != "") {
        $.post('http://s4-phone/EditContact', JSON.stringify({
            CurrentContactName: ContactName,
            CurrentContactNumber: ContactNumber,
            CurrentContactIban: ContactIban,
            OldContactName: CurrentEditContactData.name,
            OldContactNumber: CurrentEditContactData.number,
            OldContactIban: CurrentEditContactData.iban,
        }), function(PhoneContacts){
            MI.Phone.Functions.LoadContacts(PhoneContacts);
        });
        MI.Phone.Animations.TopSlideUp(".phone-edit-contact", 250, -100);
        setTimeout(function(){
            $(".phone-edit-contact-number").val("");
            $(".phone-edit-contact-name").val("");
        }, 250)
    } else {
        MI.Phone.Notifications.Add("fas fa-exclamation-circle", MI.Phone.Functions.Lang("CONTACTS_EDIT_TITLE"), MI.Phone.Functions.Lang("ALLFIELDS"));
    }
});

$(document).on('click', '#edit-contact-delete', function(e){
    e.preventDefault();

    var ContactName = $(".phone-edit-contact-name").val();
    var ContactNumber = $(".phone-edit-contact-number").val();
    var ContactIban = $(".phone-edit-contact-iban").val();

    $.post('http://s4-phone/DeleteContact', JSON.stringify({
        CurrentContactName: ContactName,
        CurrentContactNumber: ContactNumber,
        CurrentContactIban: ContactIban,
    }), function(PhoneContacts){
        MI.Phone.Functions.LoadContacts(PhoneContacts);
    });
    MI.Phone.Animations.TopSlideUp(".phone-edit-contact", 250, -100);
    setTimeout(function(){
        $(".phone-edit-contact-number").val("");
        $(".phone-edit-contact-name").val("");
    }, 250);
});

$(document).on('click', '#edit-contact-cancel', function(e){
    e.preventDefault();

    MI.Phone.Animations.TopSlideUp(".phone-edit-contact", 250, -100);
    setTimeout(function(){
        $(".phone-edit-contact-number").val("");
        $(".phone-edit-contact-name").val("");
    }, 250)
});

$(document).on('click', '.phone-keypad-key', function(e){
    e.preventDefault();

    var PressedButton = $(this).data('keypadvalue');

    if (!isNaN(PressedButton)) {
        var keyPadHTML = $("#phone-keypad-input").text();
        $("#phone-keypad-input").text(keyPadHTML + PressedButton)
    } else if (PressedButton == "#") {
        var keyPadHTML = $("#phone-keypad-input").text();
        $("#phone-keypad-input").text(keyPadHTML + PressedButton)
    } else if (PressedButton == "*") {
        if (ClearNumberTimer == null) {
            $("#phone-keypad-input").text("Silindi")
            ClearNumberTimer = setTimeout(function(){
                $("#phone-keypad-input").text("");
                ClearNumberTimer = null;
            }, 750);
        }
    }
})

var OpenedContact = null;

$(document).on('click', '.phone-contact-actions', function(e){
    e.preventDefault();

    var FocussedContact = $(this).parent();
    var ContactId = $(FocussedContact).data('contactid');

    if (OpenedContact === null) {
        $(FocussedContact).animate({
            "height":"12vh"
        }, 150, function(){
            $(FocussedContact).find('.phone-contact-action-buttons').fadeIn(100);
        });
        OpenedContact = ContactId;
    } else if (OpenedContact == ContactId) {
        $(FocussedContact).find('.phone-contact-action-buttons').fadeOut(100, function(){
            $(FocussedContact).animate({
                "height":"4.5vh"
            }, 150);
        });
        OpenedContact = null;
    } else if (OpenedContact != ContactId) {
        var PreviousContact = $(".phone-contact-list").find('[data-contactid="'+OpenedContact+'"]');
        $(PreviousContact).find('.phone-contact-action-buttons').fadeOut(100, function(){
            $(PreviousContact).animate({
                "height":"4.5vh"
            }, 150);
            OpenedContact = ContactId;
        });
        $(FocussedContact).animate({
            "height":"12vh"
        }, 150, function(){
            $(FocussedContact).find('.phone-contact-action-buttons').fadeIn(100);
        });
    }
});


$(document).on('click', '#phone-plus-icon', function(e){
    e.preventDefault();

    MI.Phone.Animations.TopSlideDown(".phone-add-contact", 200, 0);
});

$(document).on('click', '#add-contact-save', function(e){
    e.preventDefault();

    var ContactName = $(".phone-add-contact-name").val();
    var ContactNumber = $(".phone-add-contact-number").val();
    var ContactIban = $(".phone-add-contact-iban").val();

    if (ContactName != "" && ContactNumber != "") {
        $.post('http://s4-phone/AddNewContact', JSON.stringify({
            ContactName: ContactName,
            ContactNumber: ContactNumber,
            ContactIban: ContactIban,
        }), function(PhoneContacts){
            MI.Phone.Functions.LoadContacts(PhoneContacts);
        });
        MI.Phone.Animations.TopSlideUp(".phone-add-contact", 250, -100);
        setTimeout(function(){
            $(".phone-add-contact-number").val("");
            $(".phone-add-contact-name").val("");
        }, 250)

        if (SelectedSuggestion !== null) {
            $.post('http://s4-phone/RemoveSuggestion', JSON.stringify({
                data: $(SelectedSuggestion).data('SuggestionData')
            }));
            $(SelectedSuggestion).remove();
            SelectedSuggestion = null;
            var amount = parseInt(AmountOfSuggestions);
            if ((amount - 1) === 0) {
                amount = 0
            }
            $(".amount-of-suggested-contacts").html(amount + " contacts");
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-exclamation-circle", MI.Phone.Functions.Lang("CONTACTS_ADD_TITLE"), MI.Phone.Functions.Lang("ALLFIELDS"));
    }
});

$(document).on('click', '#add-contact-cancel', function(e){
    e.preventDefault();

    MI.Phone.Animations.TopSlideUp(".phone-add-contact", 250, -100);
    setTimeout(function(){
        $(".phone-add-contact-number").val("");
        $(".phone-add-contact-name").val("");
    }, 250)
});

$(document).on('click', '#phone-start-call', function(e){
    e.preventDefault();   
    
    var ContactId = $(this).parent().parent().data('contactid');
    var ContactData = $("[data-contactid='"+ContactId+"']").data('contactData');
    
    SetupCall(ContactData);
});

SetupCall = function(cData) {
    var retval = false;
    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (!status.IsAvailable) {
    
                            $(".phone-call-outgoing").css({"display":"block"});
                            $(".phone-call-incoming").css({"display":"none"});
                            $(".phone-call-ongoing").css({"display":"none"});
                            $(".phone-call-outgoing-caller").html(cData.name);
                            MI.Phone.Functions.HeaderTextColor("white", 400);
                            MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                            setTimeout(function(){
                                $(".phone-app").css({"display":"none"});
                                MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                                MI.Phone.Functions.ToggleApp("phone-call", "block");

                            }, 450);
        
                            CallData.name = cData.name;
                            CallData.number = cData.number;
                        
                            MI.Phone.Data.currentApplication = "phone-call";
                        } else {
                            MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), "Ulaşılamıyor!");
                        }
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                //MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone-volume", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
}

CancelOutgoingCall = function() {
    if (MI.Phone.Data.currentApplication == "phone-call") {
        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
        MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
        setTimeout(function(){
            MI.Phone.Functions.ToggleApp(MI.Phone.Data.currentApplication, "none");
        }, 400)
        MI.Phone.Functions.HeaderTextColor("white", 300);
    
        MI.Phone.Data.CallActive = false;
        MI.Phone.Data.currentApplication = null;
    }
}

$(document).on('click', '#outgoing-cancel', function(e){
    e.preventDefault();

    $.post('http://s4-phone/CancelOutgoingCall');
});

$(document).on('click', '#incoming-deny', function(e){
    e.preventDefault();

    $.post('http://s4-phone/DenyIncomingCall');
});

$(document).on('click', '#ongoing-cancel', function(e){
    e.preventDefault();
    
    $.post('http://s4-phone/CancelOngoingCall');
});

IncomingCallAlert = function(CallData, Canceled, AnonymousCall) {
    if (!Canceled) {
        if (!MI.Phone.Data.CallActive) {
            MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
            MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
            setTimeout(function(){
                var Label = "Bu kişi seni arıyor: "+CallData.name
                if (AnonymousCall) {
                    Label = "Gizli numaradan aranıyorsun."
                }
                $(".call-notifications-title").html("Gelen Arama");
                $(".call-notifications-content").html(Label);
                $(".call-notifications").css({"display":"block"});
                $(".call-notifications").animate({
                    right: 5+"vh"
                }, 400);
                $(".phone-call-outgoing").css({"display":"none"});
                $(".phone-call-incoming").css({"display":"block"});
                $(".phone-call-ongoing").css({"display":"none"});
                $(".phone-call-incoming-caller").html(CallData.name);
                $(".phone-app").css({"display":"none"});
                MI.Phone.Functions.HeaderTextColor("white", 400);
                $("."+MI.Phone.Data.currentApplication+"-app").css({"display":"none"});
                $(".phone-call-app").css({"display":"block"});
                setTimeout(function(){
                    MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                }, 400);
            }, 400);
        
            MI.Phone.Data.currentApplication = "phone-call";
            MI.Phone.Data.CallActive = true;
        }
        setTimeout(function(){
            $(".call-notifications").addClass('call-notifications-shake');
            setTimeout(function(){
                $(".call-notifications").removeClass('call-notifications-shake');
            }, 1000);
        }, 400);
    } else {
        $(".call-notifications").animate({
            right: -35+"vh"
        }, 400);
        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
        MI.Phone.Animations.TopSlideUp('.'+MI.Phone.Data.currentApplication+"-app", 400, -160);
        setTimeout(function(){
            $("."+MI.Phone.Data.currentApplication+"-app").css({"display":"none"});
            $(".phone-call-outgoing").css({"display":"none"});
            $(".phone-call-incoming").css({"display":"none"});
            $(".phone-call-ongoing").css({"display":"none"});
            $(".call-notifications").css({"display":"block"});
        }, 400)
        MI.Phone.Functions.HeaderTextColor("white", 300);
        MI.Phone.Data.CallActive = false;
        MI.Phone.Data.currentApplication = null;
    }
}

MI.Phone.Functions.SetupCurrentCall = function(cData) {
    if (cData.InCall) {
        CallData = cData;
        $(".phone-currentcall-container").css({"display":"block"});

        if (cData.CallType == "incoming") {
            $(".phone-currentcall-title").html("Gelen Arama");
        } else if (cData.CallType == "outgoing") {
            $(".phone-currentcall-title").html("Giden Arama");
        } else if (cData.CallType == "ongoing") {
            $(".phone-currentcall-title").html("Süre: ("+cData.CallTime+")");
        }
		
		
$.post("http://s4-phone/RehberVeriEkle", JSON.stringify({ cData: cData   })); 

        $(".phone-currentcall-contact").html("with "+cData.TargetData.name);
    } else {
        $(".phone-currentcall-container").css({"display":"none"});
    }
}

$(document).on('click', '.phone-currentcall-container', function(e){
    e.preventDefault();

    if (CallData.CallType == "incoming") {
        $(".phone-call-incoming").css({"display":"block"});
        $(".phone-call-outgoing").css({"display":"none"});
        $(".phone-call-ongoing").css({"display":"none"});
    } else if (CallData.CallType == "outgoing") {
        $(".phone-call-incoming").css({"display":"none"});
        $(".phone-call-outgoing").css({"display":"block"});
        $(".phone-call-ongoing").css({"display":"none"});
    } else if (CallData.CallType == "ongoing") {
        $(".phone-call-incoming").css({"display":"none"});
        $(".phone-call-outgoing").css({"display":"none"});
        $(".phone-call-ongoing").css({"display":"block"});
    }
    $(".phone-call-ongoing-caller").html(CallData.name);

    MI.Phone.Functions.HeaderTextColor("white", 500);
    MI.Phone.Animations.TopSlideDown('.phone-application-container', 500, 0);
    MI.Phone.Animations.TopSlideDown('.phone-call-app', 500, 0);
    MI.Phone.Functions.ToggleApp("phone-call", "block");
                
    MI.Phone.Data.currentApplication = "phone-call";
});

$(document).on('click', '#incoming-answer', function(e){
    e.preventDefault();

    $.post('http://s4-phone/AnswerCall');
});

MI.Phone.Functions.AnswerCall = function(CallData) {
    $(".phone-call-incoming").css({"display":"none"});
    $(".phone-call-outgoing").css({"display":"none"});
    $(".phone-call-ongoing").css({"display":"block"});
    $(".phone-call-ongoing-caller").html(CallData.TargetData.name);

    MI.Phone.Functions.Close();
}

MI.Phone.Functions.SetupSuggestedContacts = function(Suggested) {
    $(".suggested-contacts").html("");
    AmountOfSuggestions = Suggested.length;
    if (AmountOfSuggestions > 0) {
        $(".amount-of-suggested-contacts").html(AmountOfSuggestions + " Kayıtlı kişi");
        Suggested = Suggested.reverse();
        $.each(Suggested, function(index, suggest){
            var elem = '<div class="suggested-contact" id="suggest-'+index+'"><i class="fas fa-user-check"></i> <span class="suggested-name">'+suggest.name[0]+' '+suggest.name[1]+' &middot; <span class="suggested-number">'+suggest.number+'</span></span> </div>';
            $(".suggested-contacts").append(elem);
            $("#suggest-"+index).data('SuggestionData', suggest);
        });
    } else {
        $(".amount-of-suggested-contacts").html("0 Kayıtlı kişi");
    }
}

$(document).on('click', '.suggested-contact', function(e){
    e.preventDefault();

    var SuggestionData = $(this).data('SuggestionData');
    SelectedSuggestion = this;

    MI.Phone.Animations.TopSlideDown(".phone-add-contact", 200, 0);
    
    $(".phone-add-contact-name").val(SuggestionData.name[0] + " " + SuggestionData.name[1]);
    $(".phone-add-contact-number").val(SuggestionData.number);
    $(".phone-add-contact-iban").val(SuggestionData.bank);
});

/// TWITTER

var CurrentTwitterTab = "twitter-home"
var HashtagOpen = false;
var MinimumTrending = 100;
let url;

$(document).on('click', '.twitter-header-tab', function (e) {
    e.preventDefault();

    var PressedTwitterTab = $(this).data('twittertab');
    var PreviousTwitterTabObject = $('.twitter-header').find('[data-twittertab="' + CurrentTwitterTab + '"]');

    if (PressedTwitterTab !== CurrentTwitterTab) {
        $(this).addClass('selected-twitter-header-tab');
        $(PreviousTwitterTabObject).removeClass('selected-twitter-header-tab');

        $("." + CurrentTwitterTab + "-tab").css({
            "display": "none"
        });
        $("." + PressedTwitterTab + "-tab").css({
            "display": "block"
        });

        if (PressedTwitterTab === "twitter-mentions") {
            $.post('http://s4-phone/ClearMentions');
        }

        if (PressedTwitterTab == "twitter-home") {

            $.post('http://s4-phone/GetTweets', JSON.stringify({}), function (Tweets) {
                MI.Phone.Notifications.LoadTweets(Tweets);

            });

        }
        if (PressedTwitterTab == "twitter-self") {
            $.post('http://s4-phone/GetSelfTweets', JSON.stringify({}), function (selfdata) {
                MI.Phone.Notifications.LoadSelfTweets(selfdata)
            })

        }



        CurrentTwitterTab = PressedTwitterTab;

        if (HashtagOpen) {
            event.preventDefault();

            $(".twitter-hashtag-tweets").css({
                "left": "30vh"
            });
            $(".twitter-hashtags").css({
                "left": "0vh"
            });
            $(".twitter-new-tweet").css({
                "display": "block"
            });
            $(".twitter-hashtags").css({
                "display": "block"
            });
            HashtagOpen = false;
        }
    } else if (CurrentTwitterTab == "twitter-hashtags" && PressedTwitterTab == "twitter-hashtags") {
        if (HashtagOpen) {
            event.preventDefault();

            $(".twitter-hashtags").css({
                "display": "block"
            });
            $(".twitter-hashtag-tweets").animate({
                left: 30 + "vh"
            }, 150);
            $(".twitter-hashtags").animate({
                left: 0 + "vh"
            }, 150);
            HashtagOpen = false;
        }
    } else if (CurrentTwitterTab == "twitter-home" && PressedTwitterTab == "twitter-home") {
        event.preventDefault();

        $.post('http://s4-phone/GetTweets', JSON.stringify({}), function (Tweets) {
            MI.Phone.Notifications.LoadTweets(Tweets);
        });
    } else if (CurrentTwitterTab == "twitter-mentions" && PressedTwitterTab == "twitter-mentions") {
        event.preventDefault();

        $.post('http://s4-phone/GetMentionedTweets', JSON.stringify({}), function (MentionedTweets) {
            MI.Phone.Notifications.LoadMentionedTweets(MentionedTweets)
        })
    } else if (CurrentTwitterTab == "twitter-self" && PressedTwitterTab == "twitter-self") {
        event.preventDefault();

        $.post('http://s4-phone/GetSelfTweets', JSON.stringify({}), function (selfTweets) {
            MI.Phone.Notifications.LoadSelfTweets(selfTweets)
        })
    }


});


$(document).on('click', '.twitter-new-tweet', function (e) {
    e.preventDefault();
    MI.Phone.Animations.TopSlideDown(".twitter-new-tweet-tab", 450, 0);
});

MI.Phone.Notifications.LoadTweets = function (Tweets) {
    Tweets = Tweets.reverse();

    if (Tweets !== null && Tweets !== undefined && Tweets !== "" && Tweets.length > 0) {
        $(".twitter-home-tab").html("");
        $.each(Tweets, function (i, Tweet) {
            let TwtMessage = Tweet.message;
            let today = new Date();
            let TweetTime = new Date(Tweet.time);
            let diffMs = (today - TweetTime);
            let diffDays = Math.floor(diffMs / 86400000);
            let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            let diffSeconds = Math.round(diffMs / 1000);
            let TimeAgo = diffSeconds + ' s';
            if (diffMins > 0) {
                TimeAgo = diffMins + ' m';
            } else if (diffHrs > 0) {
                TimeAgo = diffHrs + ' h';
            } else if (diffDays > 0) {
                TimeAgo = diffDays + ' d';
            }
            let TwitterHandle = Tweet.firstName + ' ' + Tweet.lastName
            let PictureUrl = "./img/default.png"
            if (Tweet.picture !== "default") {
                PictureUrl = Tweet.picture
            }

            if (Tweet.url == "" && Tweet.message != "") {
                let TweetElement = '<div class="twitter-tweet" data-twtid = "' + Tweet.id + '" data-twthandler="@' + TwitterHandle.replace(" ", "_") + '">' +
                    '<div class="tweet-tweeter">' + Tweet.firstName + ' ' + Tweet.lastName + ' &nbsp;<span>@' + TwitterHandle.replace(" ", "_") + ' &middot; ' + TimeAgo + '</span></div>' +
                    '<div class="tweet-message">' + Tweet.message + '</div>' +
                    '<div class="twt-img" style="top: 1vh;"><img src="' + PictureUrl + '" class="tweeter-image"></div>' +
                    '<div class="tweet-reply"><i class="fas fa-reply"></i></div>'
                '</div>';
                $(".twitter-home-tab").append(TweetElement);
            } else if (Tweet.url != "" && Tweet.message == "") {
                let TweetElement = '<div class="twitter-tweet" data-twtid = "' + Tweet.id + '" data-twthandler="@' + TwitterHandle.replace(" ", "_") + '">' +
                    '<div class="tweet-tweeter">' + Tweet.firstName + ' ' + Tweet.lastName + ' &nbsp;<span>@' + TwitterHandle.replace(" ", "_") + ' &middot; ' + TimeAgo + '</span></div>' +
                    '<div class="tweet-message">' + Tweet.message + '</div>' +
                    '<img class="image" src= "' + Tweet.url + '" style = " border-radius:2px; width: 70%; position:relative; z-index: 1; left:52px; margin:.6rem .5rem .6rem 1rem;height: auto;">' +
                    '<div class="twt-img" style="top: 1vh;"><img src="' + PictureUrl + '" class="tweeter-image"></div>' +
                    '<div class="tweet-reply"><i class="fas fa-reply"></i></div>'
                '</div>';
                $(".twitter-home-tab").append(TweetElement);
            } else if (Tweet.url != "" && Tweet.message != "") {
                let TweetElement = '<div class="twitter-tweet" data-twtid = "' + Tweet.id + '" data-twthandler="@' + TwitterHandle.replace(" ", "_") + '">' +
                    '<div class="tweet-tweeter">' + Tweet.firstName + ' ' + Tweet.lastName + ' &nbsp;<span>@' + TwitterHandle.replace(" ", "_") + ' &middot; ' + TimeAgo + '</span></div>' +
                    '<div class="tweet-message">' + Tweet.message + '</div>' +
                    '<img class="image" src= "' + Tweet.url + '" style = " border-radius:2px; width: 70%; position:relative; z-index: 1; left:52px; margin:.6rem .5rem .6rem 1rem;height: auto;">' +
                    '<div class="twt-img" style="top: 1vh;"><img src="' + PictureUrl + '" class="tweeter-image"></div>' +
                    '<div class="tweet-reply"><i class="fas fa-reply"></i></div>'
                '</div>';
                $(".twitter-home-tab").append(TweetElement);
            }

        });
    } else {
        let html = `<div class="twitter-no-tweets"><p>Burada herhangi bir tweet yok</p></div>`
        $(".twitter-home-tab").html(html);

    }

}


MI.Phone.Notifications.LoadSelfTweets = function (Tweets) {
    Tweets = Tweets.reverse();

    if (Tweets !== null && Tweets !== undefined && Tweets !== "" && Tweets.length > 0) {
        $(".twitter-self-tab").html("");
        $.each(Tweets, function (i, Tweet) {
            let today = new Date();

            let TweetTime = new Date(Tweet.time);
            let diffMs = (today - TweetTime);
            let diffDays = Math.floor(diffMs / 86400000);
            let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
            let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            let diffSeconds = Math.round(diffMs / 1000);
            let TimeAgo = diffSeconds + ' s';
            if (diffMins > 0) {
                TimeAgo = diffMins + ' m';
            } else if (diffHrs > 0) {
                TimeAgo = diffHrs + ' h';
            } else if (diffDays > 0) {
                TimeAgo = diffDays + ' d';
            }
            let TwitterHandle = Tweet.firstName + ' ' + Tweet.lastName
            let PictureUrl = "./img/default.png"
            if (Tweet.picture !== "default") {
                PictureUrl = Tweet.picture
            }


            if (Tweet.url == "" && Tweet.message != "") {
                let TweetElement = '<div class="twitter-tweet" data-twtid = "' + Tweet.id + '" data-twthandler="@' + TwitterHandle.replace(" ", "_") + '">' +
                    '<div class="tweet-tweeter">' + Tweet.firstName + ' ' + Tweet.lastName + ' &nbsp;<span>@' + TwitterHandle.replace(" ", "_") + ' &middot; ' + TimeAgo + '</span></div>' +
                    '<div class="tweet-message">' + Tweet.message + '</div>' +
                    '<div class="twt-img" style="top: 1vh;"><img src="' + PictureUrl + '" class="tweeter-image"></div>' +
                    '<div class="tweet-delete"><i class="fas fa-trash-alt"></i></div>'
                '</div>';
                $(".twitter-self-tab").append(TweetElement);
            } else if (Tweet.url != "" && Tweet.message == "") {
                let TweetElement = '<div class="twitter-tweet" data-twtid = "' + Tweet.id + '" data-twthandler="@' + TwitterHandle.replace(" ", "_") + '">' +
                    '<div class="tweet-tweeter">' + Tweet.firstName + ' ' + Tweet.lastName + ' &nbsp;<span>@' + TwitterHandle.replace(" ", "_") + ' &middot; ' + TimeAgo + '</span></div>' +
                    '<div class="tweet-message">' + Tweet.message + '</div>' +
                    '<img class="image" src= "' + Tweet.url + '" style = " border-radius:2px; width: 70%; position:relative; z-index: 1; left:52px; margin:.6rem .5rem .6rem 1rem;height: auto;">' +
                    '<div class="twt-img" style="top: 1vh;"><img src="' + PictureUrl + '" class="tweeter-image"></div>' +
                    '<div class="tweet-delete"><i class="fas fa-trash-alt"></i></div>'
                '</div>';
                $(".twitter-self-tab").append(TweetElement);
            } else if (Tweet.url != "" && Tweet.message != "") {
                let TweetElement = '<div class="twitter-tweet" data-twtid = "' + Tweet.id + '" data-twthandler="@' + TwitterHandle.replace(" ", "_") + '">' +
                    '<div class="tweet-tweeter">' + Tweet.firstName + ' ' + Tweet.lastName + ' &nbsp;<span>@' + TwitterHandle.replace(" ", "_") + ' &middot; ' + TimeAgo + '</span></div>' +
                    '<div class="tweet-message">' + Tweet.message + '</div>' +
                    '<img class="image" src= "' + Tweet.url + '" style = " border-radius:2px; width: 70%; position:relative; z-index: 1; left:52px; margin:.6rem .5rem .6rem 1rem;height: auto;">' +
                    '<div class="twt-img" style="top: 1vh;"><img src="' + PictureUrl + '" class="tweeter-image"></div>' +
                    '<div class="tweet-delete"><i class="fas fa-trash-alt"></i></div>'
                '</div>';
                $(".twitter-self-tab").append(TweetElement);
            }

        });
    } else {
        let html = `<div class="twitter-no-tweets"><p>Burada herhangi bir tweet yok!</p></div>`
        $(".twitter-self-tab").html(html);

    }

}

$(document).on('click', '.tweet-reply', function (e) {
    e.preventDefault();
    var TwtName = $(this).parent().data('twthandler');
    var text = $(this).parent().data();
    $("#tweet-new-message").val(TwtName);
    MI.Phone.Animations.TopSlideDown(".twitter-new-tweet-tab", 450, 0);
});

$(document).on('click', '.tweet-delete', function (e) {
    e.preventDefault();
    var id = $(this).parent().data('twtid');
    // console.log(id)
    $.post('http://s4-phone/DeleteTweet', JSON.stringify({
        id: id,
    }));

    $.post('http://s4-phone/GetSelfTweets', JSON.stringify({}), function (tweets) {
        MI.Phone.Notifications.LoadSelfTweets(tweets);
    });
    $.post('http://s4-phone/GetTweets', JSON.stringify({}), function (tweets) {
        MI.Phone.Notifications.LoadTweets(tweets);
    });


});



let clicked = false;
let photos = [];
$(document).on('click', '.image', function (e) {
    if (!clicked) {
        let n = $(this).clone()

        $(n).appendTo('.tt')
        $(n).css({
            "position": "absolute",
            "width": "500px",
            "height": "auto",
            "left": "-520px",
            "top": "-10px",

            "border-radius": "1rem"
        })
        clicked = true;
        photos.push(n)
    } else {
        for (let i = 0; i < photos.length; i++) {
            photos[i].remove()
        }
        clicked = false;
    }
});







MI.Phone.Notifications.LoadMentionedTweets = function (Tweets) {
    Tweets = Tweets.reverse();
    if (Tweets.length > 0) {
        $(".twitter-mentions-tab").html("");
        $.each(Tweets, function (i, Tweet) {
            var TwtMessage = Tweet.message;
            var today = new Date();
            var TweetTime = new Date(Tweet.time);
            var diffMs = (today - TweetTime);
            var diffDays = Math.floor(diffMs / 86400000);
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            var diffSeconds = Math.round(diffMs / 1000);
            var TimeAgo = diffSeconds + ' sn';

            if (diffSeconds > 60) {
                TimeAgo = diffMins + ' dk';
            } else if (diffMins > 60) {
                TimeAgo = diffHrs + ' s';
            } else if (diffHrs > 24) {
                TimeAgo = diffDays + ' d';
            }

            var TwitterHandle = Tweet.firstName + ' ' + Tweet.lastName
            var PictureUrl = "./img/default.png";
            if (Tweet.picture !== "default") {
                PictureUrl = Tweet.picture
            }

            var TweetElement =
                '<div class="twitter-tweet">' +
                '<div class="tweet-tweeter">' + Tweet.firstName + ' ' + Tweet.lastName + ' &nbsp;<span>@' + TwitterHandle.replace(" ", "_") + ' &middot; ' + TimeAgo + '</span></div>' +
                '<div class="tweet-message">' + TwtMessage + '</div>' +
                '<div class="twt-img" style="top: 1vh;"><img src="' + PictureUrl + '" class="tweeter-image"></div></div>';

            $(".twitter-mentioned-tweet").css({
                "background-color": "#F5F8FA"
            });
            $(".twitter-mentions-tab").append(TweetElement);
        });
    }
}

MI.Phone.Functions.FormatTwitterMessage = function (TwitterMessage) {
    var TwtMessage = TwitterMessage;
    var res = TwtMessage.split("@");
    var tags = TwtMessage.split("#");
    var InvalidSymbols = [
        "[",
        "?",
        "!",
        "@",
        "#",
        "]",
    ]

    for (i = 1; i < res.length; i++) {
        var MentionTag = res[i].split(" ")[0];
        if (MentionTag !== null && MentionTag !== undefined && MentionTag !== "") {
            TwtMessage = TwtMessage.replace("@" + MentionTag, "<span class='mentioned-tag' data-mentiontag='@" + MentionTag + "' style='color: rgb(27, 149, 224);'>@" + MentionTag + "</span>");
        }
    }

    for (i = 1; i < tags.length; i++) {
        var Hashtag = tags[i].split(" ")[0];

        for (i = 1; i < InvalidSymbols.length; i++) {
            var symbol = InvalidSymbols[i];
            var res = Hashtag.indexOf(symbol);

            if (res > -1) {
                Hashtag = Hashtag.replace(symbol, "");
            }
        }

        if (Hashtag !== null && Hashtag !== undefined && Hashtag !== "") {
            TwtMessage = TwtMessage.replace("#" + Hashtag, "<span class='hashtag-tag-text' data-hashtag='" + Hashtag + "' style='color: rgb(27, 149, 224);'>#" + Hashtag + "</span>");
        }
    }

    return TwtMessage
}

$(document).on('click', '#send-tweet', function (e) {
    e.preventDefault();
   
   
    var TweetMessage = $("#tweet-new-message").val();
 
    var TweetUrl = $("#tweet-new-url").val();

    if (TweetMessage != "" || TweetUrl != "") {
        let CurrentDate = new Date();
        $.post('http://s4-phone/PostNewTweet', JSON.stringify({
            Message: TweetMessage,
			Foto: TweetUrl,
            Date: CurrentDate,
            Picture: MI.Phone.Data.MetaData.profilepicture
        }), function (Tweets) {
            MI.Phone.Notifications.LoadTweets(Tweets)


        });

        $.post('http://s4-phone/GetHashtags', JSON.stringify({}), function (Hashtags) {
            MI.Phone.Notifications.LoadHashtags(Hashtags)
        })
 
        MI.Phone.Animations.TopSlideUp(".twitter-new-tweet-tab", 450, -120);
        $('#tweet-new-url').val("")
        $("#tweet-new-message").val("");
    } else {
        MI.Phone.Notifications.Add("fab fa-twitter", MI.Phone.Functions.Lang("TWITTER_TITLE"), MI.Phone.Functions.Lang("TWITTER_ENTER_MSG"), "#1DA1F2");
    }
});


$(document).on('click', '#send-photo', function (e) {
    e.preventDefault();
$('#tweet-new-url').val("");
    $.post('http://s4-phone/PostNewImage', JSON.stringify({}),
        function (url) {
            $('#tweet-new-url').val(url)

        },
    );



    MI.Phone.Functions.Close();

});

$(document).on('click', '#cancel-tweet', function (e) {
    e.preventDefault();
    $('#tweet-new-url').val("")
    $("#tweet-new-message").val("");
    MI.Phone.Animations.TopSlideUp(".twitter-new-tweet-tab", 450, -120);
});

$(document).on('click', '.mentioned-tag', function (e) {
    e.preventDefault();
    CopyMentionTag(this);
});

$(document).on('click', '.hashtag-tag-text', function (e) {
    e.preventDefault();
    if (!HashtagOpen) {
        var Hashtag = $(this).data('hashtag');
        var PreviousTwitterTabObject = $('.twitter-header').find('[data-twittertab="' + CurrentTwitterTab + '"]');

        $("#twitter-hashtags").addClass('selected-twitter-header-tab');
        $(PreviousTwitterTabObject).removeClass('selected-twitter-header-tab');

        $("." + CurrentTwitterTab + "-tab").css({
            "display": "none"
        });
        $(".twitter-hashtags-tab").css({
            "display": "block"
        });

        $.post('http://s4-phone/GetHashtagMessages', JSON.stringify({
            hashtag: Hashtag
        }), function (HashtagData) {
            MI.Phone.Notifications.LoadHashtagMessages(HashtagData.messages);
        });

        $(".twitter-hashtag-tweets").css({
            "display": "block",
            "left": "30vh"
        });
        $(".twitter-hashtag-tweets").css({
            "left": "0vh"
        });
        $(".twitter-hashtags").css({
            "left": "-30vh"
        });
        $(".twitter-hashtags").css({
            "display": "none"
        });
        HashtagOpen = true;

        CurrentTwitterTab = "twitter-hashtags";
    }
});

function CopyMentionTag(elem) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(elem).data('mentiontag')).select();
    MI.Phone.Notifications.Add("fab fa-twitter", MI.Phone.Functions.Lang("TWITTER_TITLE"), $(elem).data('mentiontag') + " Copied!", "rgb(27, 149, 224)", 1250);
    document.execCommand("copy");
    $temp.remove();
}

MI.Phone.Notifications.LoadHashtags = function (hashtags) {
    if (hashtags !== null) {
        $(".twitter-hashtags").html("");
        // console.log(JSON.stringify(hashtags));
        $.each(hashtags, function (i, hashtag) {
            var Elem = '';
            var TweetHandle = "Tweet";
            if (hashtag.messages.length > 1) {
                TweetHandle = "Tweets";
            }
            if (hashtag.messages.length >= MinimumTrending) {
                Elem = '<div class="twitter-hashtag" id="tag-' + hashtag.hashtag + '"><div class="twitter-hashtag-status">Trending</div> <div class="twitter-hashtag-tag">#' + hashtag.hashtag + '</div> <div class="twitter-hashtag-messages">' + hashtag.messages.length + ' ' + TweetHandle + '</div> </div>';
            } else {
                Elem = '<div class="twitter-hashtag" id="tag-' + hashtag.hashtag + '"><div class="twitter-hashtag-status">Not Trending</div> <div class="twitter-hashtag-tag">#' + hashtag.hashtag + '</div> <div class="twitter-hashtag-messages">' + hashtag.messages.length + ' ' + TweetHandle + '</div> </div>';
            }

            $(".twitter-hashtags").append(Elem);
            $("#tag-" + hashtag.hashtag).data('tagData', hashtag);
        });
    }
}

MI.Phone.Notifications.LoadHashtagMessages = function (Tweets) {
    Tweets = Tweets.reverse();
    if (Tweets !== null && Tweets !== undefined && Tweets !== "" && Tweets.length > 0) {
        $(".twitter-hashtag-tweets").html("");
        $.each(Tweets, function (i, Tweet) {
            var TwtMessage = MI.Phone.Functions.FormatTwitterMessage(Tweet.message);
            var today = new Date();
            var TweetTime = new Date(Tweet.time);
            var diffMs = (today - TweetTime);
            var diffDays = Math.floor(diffMs / 86400000);
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
            var diffSeconds = Math.round(diffMs / 1000);
            var TimeAgo = diffSeconds + ' sn';

            if (diffSeconds > 60) {
                TimeAgo = diffMins + ' dk';
            } else if (diffMins > 60) {
                TimeAgo = diffHrs + ' s';
            } else if (diffHrs > 24) {
                TimeAgo = diffDays + ' d';
            }

            var TwitterHandle = Tweet.firstName + ' ' + Tweet.lastName
            var PictureUrl = "./img/default.png"
            if (Tweet.picture !== "default") {
                PictureUrl = Tweet.picture
            }

            var TweetElement =
                '<div class="twitter-tweet">' +
                '<div class="tweet-tweeter">' + Tweet.firstName + ' ' + Tweet.lastName + ' &nbsp;<span>@' + TwitterHandle.replace(" ", "_") + ' &middot; ' + TimeAgo + '</span></div>' +
                '<div class="tweet-message">' + TwtMessage + '</div>' +
                '<div class="twt-img" style="top: 1vh;"><img src="' + PictureUrl + '" class="tweeter-image"></div></div>';

            $(".twitter-hashtag-tweets").append(TweetElement);
        });
    }
}

$(document).on('click', '.twitter-hashtag', function (event) {
    event.preventDefault();

    var TweetId = $(this).attr('id');
    var TweetData = $("#" + TweetId).data('tagData');

    MI.Phone.Notifications.LoadHashtagMessages(TweetData.messages);

    $(".twitter-hashtag-tweets").css({
        "display": "block",
        "left": "30vh"
    });
    $(".twitter-hashtag-tweets").animate({
        left: 0 + "vh"
    }, 150);
    $(".twitter-hashtags").animate({
        left: -30 + "vh"
    }, 150, function () {
        $(".twitter-hashtags").css({
            "display": "none"
        });
    });
    HashtagOpen = true;
});

// Whatsapp


var WhatsappSearchActive = false;
var OpenedChatPicture = null;

$(document).ready(function(){
    $("#whatsapp-search-input").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".whatsapp-chats .whatsapp-chat").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

$(document).on('click', '#whatsapp-search-chats', function(e){
    e.preventDefault();

    if ($("#whatsapp-search-input").css('display') == "none") {
        $("#whatsapp-search-input").fadeIn(150);
        WhatsappSearchActive = true;
    } else {
        $("#whatsapp-search-input").fadeOut(150);
        WhatsappSearchActive = false;
    }
});

$(document).on('click', '.whatsapp-chat', function(e){
    e.preventDefault();

    var ChatId = $(this).attr('id');
    var ChatData = $("#"+ChatId).data('chatdata');

    MI.Phone.Functions.SetupChatMessages(ChatData);

    $.post('http://s4-phone/ClearAlerts', JSON.stringify({
        number: ChatData.number
    }));

    if (WhatsappSearchActive) {
        $("#whatsapp-search-input").fadeOut(150);
    }

    $(".whatsapp-openedchat").css({"display":"block"});
    $(".whatsapp-openedchat").animate({
        left: 0+"vh"
    },200);
    
    $(".whatsapp-chats").animate({
        left: 30+"vh"
    },200, function(){
        $(".whatsapp-chats").css({"display":"none"});
    });

    $('.whatsapp-openedchat-messages').animate({scrollTop: 9999}, 150);

    if (OpenedChatPicture == null) {
        OpenedChatPicture = "./img/default.png";
        if (ChatData.picture != null || ChatData.picture != undefined || ChatData.picture != "default") {
            OpenedChatPicture = ChatData.picture
        }
        $(".whatsapp-openedchat-picture").css({"background-image":"url("+OpenedChatPicture+")"});
    }
});

$(document).on('click', '#whatsapp-openedchat-back', function(e){
    e.preventDefault();
    $.post('http://s4-phone/GetWhatsappChats', JSON.stringify({}), function(chats){
        MI.Phone.Functions.LoadWhatsappChats(chats);
    });
    OpenedChatData.number = null;
    $(".whatsapp-chats").css({"display":"block"});
    $(".whatsapp-chats").animate({
        left: 0+"vh"
    }, 200);
    $(".whatsapp-openedchat").animate({
        left: -30+"vh"
    }, 200, function(){
        $(".whatsapp-openedchat").css({"display":"none"});
    });
    OpenedChatPicture = null;
});

MI.Phone.Functions.GetLastMessage = function(messages) {
    var CurrentDate = new Date();
    var CurrentMonth = CurrentDate.getMonth();
    var CurrentDOM = CurrentDate.getDate();
    var CurrentYear = CurrentDate.getFullYear();
    var LastMessageData = {
        time: "00:00",
        message: "nikss"
    }

    $.each(messages[messages.length - 1], function(i, msg){
        var msgData = msg[msg.length - 1];
        LastMessageData.time = msgData.time
        LastMessageData.message = msgData.message
    });

    return LastMessageData
}

GetCurrentDateKey = function() {
    var CurrentDate = new Date();
    var CurrentMonth = CurrentDate.getMonth();
    var CurrentDOM = CurrentDate.getDate();
    var CurrentYear = CurrentDate.getFullYear();
    var CurDate = ""+CurrentDOM+"-"+CurrentMonth+"-"+CurrentYear+"";

    return CurDate;
}

MI.Phone.Functions.LoadWhatsappChats = function(chats) {
    $(".whatsapp-chats").html("");
    $.each(chats, function(i, chat){
        var profilepicture = "./img/default.png";
        if (chat.picture !== "default") {
            profilepicture = chat.picture
        }
        var LastMessage = MI.Phone.Functions.GetLastMessage(chat.messages);
        var ChatElement = '<div class="whatsapp-chat" id="whatsapp-chat-'+i+'"><div class="whatsapp-chat-picture" style="background-image: url('+profilepicture+');"></div><div class="whatsapp-chat-name"><p>'+chat.name+'</p></div><div class="whatsapp-chat-lastmessage"><p>'+LastMessage.message+'</p></div> <div class="whatsapp-chat-lastmessagetime"><p>'+LastMessage.time+'</p></div><div class="whatsapp-chat-unreadmessages unread-chat-id-'+i+'">1</div></div>';
        
        $(".whatsapp-chats").append(ChatElement);
        $("#whatsapp-chat-"+i).data('chatdata', chat);

        if (chat.Unread > 0 && chat.Unread !== undefined && chat.Unread !== null) {
            $(".unread-chat-id-"+i).html(chat.Unread);
            $(".unread-chat-id-"+i).css({"display":"block"});
        } else {
            $(".unread-chat-id-"+i).css({"display":"none"});
        }
    });
}

MI.Phone.Functions.ReloadWhatsappAlerts = function(chats) {
    $.each(chats, function(i, chat){
        if (chat.Unread > 0 && chat.Unread !== undefined && chat.Unread !== null) {
            $(".unread-chat-id-"+i).html(chat.Unread);
            $(".unread-chat-id-"+i).css({"display":"block"});
        } else {
            $(".unread-chat-id-"+i).css({"display":"none"});
        }
    });
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

FormatChatDate = function(date) {
    var TestDate = date.split("-");
    var NewDate = new Date((parseInt(TestDate[1]) + 1)+"-"+TestDate[0]+"-"+TestDate[2]);

    var CurrentMonth = monthNames[NewDate.getMonth()];
    var CurrentDOM = NewDate.getDate();
    var CurrentYear = NewDate.getFullYear();
    var CurDateee = CurrentDOM + "-" + NewDate.getMonth() + "-" + CurrentYear;
    var ChatDate = CurrentDOM + " " + CurrentMonth + " " + CurrentYear;
    var CurrentDate = GetCurrentDateKey();

    var ReturnedValue = ChatDate;
    if (CurrentDate == CurDateee) {
        ReturnedValue = "Today";
    }

    return ReturnedValue;
}

FormatMessageTime = function() {
    var NewDate = new Date();
    var NewHour = NewDate.getHours();
    var NewMinute = NewDate.getMinutes();
    var Minutessss = NewMinute;
    var Hourssssss = NewHour;
    if (NewMinute < 10) {
        Minutessss = "0" + NewMinute;
    }
    if (NewHour < 10) {
        Hourssssss = "0" + NewHour;
    }
    var MessageTime = Hourssssss + ":" + Minutessss
    return MessageTime;
}

$(document).on('click', '#whatsapp-openedchat-send', function(e){
    e.preventDefault();

    var Message = $("#whatsapp-openedchat-message").val();

    if (Message !== null && Message !== undefined && Message !== "") {
        $.post('http://s4-phone/SendMessage', JSON.stringify({
            ChatNumber: OpenedChatData.number,
            ChatDate: GetCurrentDateKey(),
            ChatMessage: Message,
            ChatTime: FormatMessageTime(),
            ChatType: "message",
        }));
        $("#whatsapp-openedchat-message").val("");
    } else {
        MI.Phone.Notifications.Add("fab fa-whatsapp", MI.Phone.Functions.Lang("WHATSAPP_TITLE"), MI.Phone.Functions.Lang("WHATSAPP_BLANK_MSG"), "#25D366", 1750);
    }
});

$(document).on('keypress', function (e) {
    if (OpenedChatData.number !== null) {
        if(e.which === 13){
            var Message = $("#whatsapp-openedchat-message").val();
    
            if (Message !== null && Message !== undefined && Message !== "") {
                $.post('http://s4-phone/SendMessage', JSON.stringify({
                    ChatNumber: OpenedChatData.number,
                    ChatDate: GetCurrentDateKey(),
                    ChatMessage: Message,
                    ChatTime: FormatMessageTime(),
                    ChatType: "message",
                }));
                $("#whatsapp-openedchat-message").val("");
            } else {
                MI.Phone.Notifications.Add("fab fa-whatsapp", MI.Phone.Functions.Lang("WHATSAPP_TITLE"), MI.Phone.Functions.Lang("WHATSAPP_BLANK_MSG"), "#25D366", 1750);
            }
        }
    }
});

$(document).on('click', '#send-location', function(e){
    e.preventDefault();

    $.post('http://s4-phone/SendMessage', JSON.stringify({
        ChatNumber: OpenedChatData.number,
        ChatDate: GetCurrentDateKey(),
        ChatMessage: "Shared Location",
        ChatTime: FormatMessageTime(),
        ChatType: "location",
    }));
});


function gifgonder(x) {
	
	 $.post('http://s4-phone/SendMessage', JSON.stringify({
        ChatNumber: OpenedChatData.number,
        ChatDate: GetCurrentDateKey(),
        ChatMessage: $('#gif_'+x).attr('src'),
        ChatTime: FormatMessageTime(),
        ChatType: "gif",
     }));
	 $(".gifler").css("display","none");
}

function gifkapat(){$(".gifler").css("display","none");}

$(document).on('click', '#send-gif', function(e){
    e.preventDefault();
   
    $(".gifler").css("display","block");
			 
 
});

var wpfoto = null;

$(document).on('click', '#send-image', function(e){
    e.preventDefault();

  //  $.post('http://s4-phone/SendMessage', JSON.stringify({
  //      ChatNumber: OpenedChatData.number,
  //      ChatDate: GetCurrentDateKey(),
  //      ChatMessage: "Shared Location",
  //      ChatTime: FormatMessageTime(),
  //      ChatType: "location",
  //  }));
  
 	$.post('http://s4-phone/PostNewImage', JSON.stringify({}),
        function (url) {
             $(".wpfoto").css("display","block");
			 $(".wpfoto img").attr("src", url);
             wpfoto = url;
        },
    );
	
	
   
	MI.Phone.Functions.Close();
});


function gonderwp() {
    $.post('http://s4-phone/SendMessage', JSON.stringify({
        ChatNumber: OpenedChatData.number,
        ChatDate: GetCurrentDateKey(),
        ChatMessage: wpfoto,
        ChatTime: FormatMessageTime(),
        ChatType: "foto",
     }));
	 $(".wpfoto").css("display","none");
}

function iptalwp() {
	$(".wpfoto").css("display","none");
	wpfoto = null;
}

MI.Phone.Functions.SetupChatMessages = function(cData, NewChatData) {
    if (cData) {
        OpenedChatData.number = cData.number;

        if (OpenedChatPicture == null) {
            $.post('http://s4-phone/GetProfilePicture', JSON.stringify({
                number: OpenedChatData.number,
            }), function(picture){
                OpenedChatPicture = "./img/default.png";
                if (picture != "default" && picture != null) {
                    OpenedChatPicture = picture
                }
                $(".whatsapp-openedchat-picture").css({"background-image":"url("+OpenedChatPicture+")"});
            });
        } else {
            $(".whatsapp-openedchat-picture").css({"background-image":"url("+OpenedChatPicture+")"});
        }

        $(".whatsapp-openedchat-name").html("<p>"+cData.name+"</p>");
        $(".whatsapp-openedchat-messages").html("");

        $.each(cData.messages, function(i, chat){

            var ChatDate = FormatChatDate(chat.date);
            var ChatDiv = '<div class="whatsapp-openedchat-messages-'+i+' unique-chat"><div class="whatsapp-openedchat-date">'+ChatDate+'</div></div>';

            $(".whatsapp-openedchat-messages").append(ChatDiv);
    
            $.each(cData.messages[i].messages, function(index, message){
                var Sender = "me";
                if (message.sender !== MI.Phone.Data.PlayerData.citizenid) { Sender = "other"; }
                var MessageElement
                if (message.type == "message") {
                    MessageElement = '<div class="whatsapp-openedchat-message whatsapp-openedchat-message-'+Sender+'">'+message.message+'<div class="whatsapp-openedchat-message-time">'+message.time+'</div></div><div class="clearfix"></div>'
                } else if (message.type == "location") {
                    MessageElement = '<div class="whatsapp-openedchat-message whatsapp-openedchat-message-'+Sender+' whatsapp-shared-location" data-x="'+message.data.x+'" data-y="'+message.data.y+'"><span style="font-size: 1.2vh;"><i class="fas fa-thumbtack" style="font-size: 1vh;"></i> Paylaşılan Konum</span><div class="whatsapp-openedchat-message-time">'+message.time+'</div></div><div class="clearfix"></div>'
                }else if (message.type == "foto") {
                    MessageElement = '<div style="max-width: 100%;" class="whatsapp-openedchat-message whatsapp-openedchat-message-'+Sender+'"><img src="'+message.message+'" style="    width: 165px;" /><div class="whatsapp-openedchat-message-time">'+message.time+'</div></div><div class="clearfix"></div>'
                }else if (message.type == "gif") {
				    MessageElement = '<div style="max-width: 100%;" class="whatsapp-openedchat-message whatsapp-openedchat-message-'+Sender+'"><img src="'+message.message+'" style="    width: 165px;" /><div class="whatsapp-openedchat-message-time">'+message.time+'</div></div><div class="clearfix"></div>'
                
				}
                $(".whatsapp-openedchat-messages-"+i).append(MessageElement);
            });
        });
        $('.whatsapp-openedchat-messages').animate({scrollTop: 9999}, 1);
    } else {
        OpenedChatData.number = NewChatData.number;
        if (OpenedChatPicture == null) {
            $.post('http://s4-phone/GetProfilePicture', JSON.stringify({
                number: OpenedChatData.number,
            }), function(picture){
                OpenedChatPicture = "./img/default.png";
                if (picture != "default" && picture != null) {
                    OpenedChatPicture = picture
                }
                $(".whatsapp-openedchat-picture").css({"background-image":"url("+OpenedChatPicture+")"});
            });
        }

        $(".whatsapp-openedchat-name").html("<p>"+NewChatData.name+"</p>");
        $(".whatsapp-openedchat-messages").html("");
        var NewDate = new Date();
        var NewDateMonth = NewDate.getMonth();
        var NewDateDOM = NewDate.getDate();
        var NewDateYear = NewDate.getFullYear();
        var DateString = ""+NewDateDOM+"-"+(NewDateMonth+1)+"-"+NewDateYear;
        var ChatDiv = '<div class="whatsapp-openedchat-messages-'+DateString+' unique-chat"><div class="whatsapp-openedchat-date">VANDAAG</div></div>';

        $(".whatsapp-openedchat-messages").append(ChatDiv);
    }

    $('.whatsapp-openedchat-messages').animate({scrollTop: 9999}, 1);
}

$(document).on('click', '.whatsapp-shared-location', function(e){
    e.preventDefault();
    var messageCoords = {}
    messageCoords.x = $(this).data('x');
    messageCoords.y = $(this).data('y');

    $.post('http://s4-phone/SharedLocation', JSON.stringify({
        coords: messageCoords,
    }))
});

var ExtraButtonsOpen = false;

$(document).on('click', '#whatsapp-openedchat-message-extras', function(e){
    e.preventDefault();

    if (!ExtraButtonsOpen) {
        $(".whatsapp-extra-buttons").css({"display":"block"}).animate({
            left: 0+"vh"
        }, 250);
        ExtraButtonsOpen = true;
    } else {
        $(".whatsapp-extra-buttons").animate({
            left: -15+"vh"
        }, 250, function(){
            $(".whatsapp-extra-buttons").css({"display":"block"});
            ExtraButtonsOpen = false;
        });
    }
});












function httpGetAsync(theUrl, callback)
{
    // create the request object
    var xmlHttp = new XMLHttpRequest();

    // set the state change callback to capture when the response comes in
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            callback(xmlHttp.responseText);
        }
    }

    // open as a GET call, pass in the url and set async = True
    xmlHttp.open("GET", theUrl, true);

    // call send with no params as they were passed in on the url string
    xmlHttp.send(null);

    return;
}

// callback for the top 8 GIFs of search
function tenorCallback_search(responsetext)
{
    // parse the json response
    var response_objects = JSON.parse(responsetext);

    top_10_gifs = response_objects["results"];

    // load the GIFs -- for our example we will load the first GIFs preview size (nanogif) and share size (tinygif)

  //   $(".gifs").html("");

    
	
var i;
for (i = 0; i < top_10_gifs.length; i++) {
  var foto = top_10_gifs[i]["media"][0]["tinygif"]["url"];
  
  $(".gifs").html(`<a href="javascript:gifgonder('${i}')"><img class="share_gif" id="gif_${i}"  src="${foto}" alt=""  ></a><br>` + $(".gifs").html() );
 
}
	
	//$(".gifs").html(top_10_gifs.length);
	

    return;

}


// function to call the trending and category endpoints
function grab_data(x)
{
    // set the apikey and limit
    var apikey = "LIVDSRZULELA";
    var lmt = 8;

    // test search term
    var search_term = x;

    // using default locale of en_US
    var search_url = "https://g.tenor.com/v1/search?q=" + search_term + "&key=" +
            apikey + "&limit=" + lmt;

    httpGetAsync(search_url,tenorCallback_search);

    // data will be loaded by each call's callback
    return;
}



function getirgifdata() { 

$(".gifs").html("");
grab_data($("#gifinput").val());


}










 /// *** arrests 
 
 SetupArrests = function(data) {
    $(".arrests2-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, arrests){
            var element = '<div class="arrests-list" id="arrestsid-'+i+'"> <div class="arrests-list-firstletter">' + (arrests.name).charAt(0).toUpperCase() + '</div> <div class="arrests-list-fullname">' + arrests.name + '</div> </div>'
            $(".arrests2-list").append(element);
            $("#arrestsid-"+i).data('arrestsData', arrests);
        });
    } else {
        var element = '<div class="arrests-list"><div class="no-arrests">Aranan kimse yok.</div></div>'
        $(".arrests2-list").append(element);
    }
}
 
 
 /// *** BANK
 
 
 var FoccusedBank = null;

$(document).on('click', '.bank-app-account', function(e){
    var copyText = document.getElementById("iban-account");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");

    MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), "IBAN Kopyalandı!", "#badc58", 1750);
});

var CurrentTab = "accounts";

$(document).on('click', '.bank-app-header-button', function(e){
    e.preventDefault();

    var PressedObject = this;
    var PressedTab = $(PressedObject).data('headertype');

    if (CurrentTab != PressedTab) {
        var PreviousObject = $(".bank-app-header").find('[data-headertype="'+CurrentTab+'"]');

        if (PressedTab == "invoices") {
            $(".bank-app-"+CurrentTab).animate({
                left: -30+"vh"
            }, 250, function(){
                $(".bank-app-"+CurrentTab).css({"display":"none"})
            });
            $(".bank-app-"+PressedTab).css({"display":"block"}).animate({
                left: 0+"vh"
            }, 250);
        } else if (PressedTab == "accounts") {
            $(".bank-app-"+CurrentTab).animate({
                left: 30+"vh"
            }, 250, function(){
                $(".bank-app-"+CurrentTab).css({"display":"none"})
            });
            $(".bank-app-"+PressedTab).css({"display":"block"}).animate({
                left: 0+"vh"
            }, 250);
        }

        $(PreviousObject).removeClass('bank-app-header-button-selected');
        $(PressedObject).addClass('bank-app-header-button-selected');
        setTimeout(function(){ CurrentTab = PressedTab; }, 300)
    }
})

MI.Phone.Functions.DoBankOpen = function(data) {
 
 
	$(".usernamebank").html(data.username);
    $(".bank-app-account-number").val("IBAN: " + data.iban);
    $(".bank-app-account-balance").html("&dollar;"+data.bank.toFixed());
    $(".bank-app-account-balance").data('balance', data.bank.toFixed());

    $(".bank-app-loaded").css({"display":"none", "padding-left":"30vh"});
    $(".bank-app-accounts").css({"left":"30vh"});
    $(".bank-logo").css({"left": "0vh"});
    $("#bank-text").css({"opacity":"0.0", "left":"9vh"});
    $(".bank-app-loading").css({
        "display":"block",
        "left":"0vh",
    });
    setTimeout(function(){
        CurrentTab = "accounts";
      //  $(".bank-logo").animate({  left: -12+"vh"  }, 500);
        setTimeout(function(){
            $("#bank-text").animate({
                opacity: 1.0,
                left: 14+"vh"
            });
        }, 100);
        setTimeout(function(){
            $(".bank-app-loaded").css({"display":"block"}).animate({"padding-left":"0"}, 300);
            $(".bank-app-accounts").animate({left:0+"vh"}, 300);
            $(".bank-app-loading").animate({
                left: -30+"vh"
            },300, function(){
                $(".bank-app-loading").css({"display":"none"});
            });
        }, 1500)
    }, 500)
}

$(document).on('click', '.bank-app-account-actions', function(e){
    MI.Phone.Animations.TopSlideDown(".bank-app-transfer", 400, 0);
});

$(document).on('click', '#cancel-transfer', function(e){
    e.preventDefault();

    MI.Phone.Animations.TopSlideUp(".bank-app-transfer", 400, -100);
});

$(document).on('click', '#accept-transfer', function(e){
    e.preventDefault();

    var iban = $("#bank-transfer-iban").val();
    var amount = Number($("#bank-transfer-amount").val());
    var amountData = Number($(".bank-app-account-balance").data('balance'));

    if (iban != "" && amount != "" && amount > 0) {
        if (amountData >= amount) {
             
            $.post('http://s4-phone/TransferMoney', JSON.stringify({
                iban: iban,
                amount: amount
            }), function(data){
                if (data.CanTransfer) {
                    $("#bank-transfer-iban").val("");
                    $("#bank-transfer-amount").val("");
                    data.NewAmount = (data.NewAmount).toFixed();
                    $(".bank-app-account-balance").html("&euro;"+data.NewAmount);
                    $(".bank-app-account-balance").data('balance', data.NewAmount);
                    MI.Phone.Notifications.Add("fas fa-university", "hazeBank", "Şu kadar; "+amount+",- $ para transfer edildi!", "#badc58", 1500);
                } else {
                     
                    MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), MI.Phone.Functions.Lang("BANK_DONT_ENOUGH"), "#badc58", 1500);
                }
            })
            MI.Phone.Animations.TopSlideUp(".bank-app-transfer", 400, -100);
        } else {
             
            MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), MI.Phone.Functions.Lang("BANK_DONT_ENOUGH"), "#badc58", 1500);
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), MI.Phone.Functions.Lang("ALLFIELDS"), "#badc58", 1750);
    }
});

$(document).on('click', '.pay-invoice', function(event){
    event.preventDefault();

    var InvoiceId = $(this).parent().parent().attr('id');
    var InvoiceData = $("#"+InvoiceId).data('invoicedata');
    var BankBalance = $(".bank-app-account-balance").data('balance');

    if (BankBalance >= InvoiceData.amount) {
        $.post('http://s4-phone/PayInvoice', JSON.stringify({
            sender: InvoiceData.sender,
            amount: InvoiceData.amount,
            invoiceId: InvoiceData.id,
        }), function(CanPay){
            if (CanPay) {
                $("#"+InvoiceId).animate({
                    left: 30+"vh",
                }, 300, function(){
                    setTimeout(function(){
                        $("#"+InvoiceId).remove();
                    }, 100);
                });
                MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), "You have &euro;"+InvoiceData.amount+" paid!", "#badc58", 1500);
                var amountData = $(".bank-app-account-balance").data('balance');
                var NewAmount = (amountData - InvoiceData.amount).toFixed();
                $("#bank-transfer-amount").val(NewAmount);
                $(".bank-app-account-balance").data('balance', NewAmount);
            } else {
                MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), MI.Phone.Functions.Lang("BANK_DONT_ENOUGH"), "#badc58", 1500);
            }
        });
    } else {
        MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), MI.Phone.Functions.Lang("BANK_DONT_ENOUGH"), "#badc58", 1500);
    }
});

$(document).on('click', '.decline-invoice', function(event){
    event.preventDefault();
    var InvoiceId = $(this).parent().parent().attr('id');
    var InvoiceData = $("#"+InvoiceId).data('invoicedata');

    $.post('http://s4-phone/DeclineInvoice', JSON.stringify({
        sender: InvoiceData.sender,
        amount: InvoiceData.amount,
        invoiceId: InvoiceData.invoiceid,
    }));
    $("#"+InvoiceId).animate({
        left: 30+"vh",
    }, 300, function(){
        setTimeout(function(){
            $("#"+InvoiceId).remove();
        }, 100);
    });
    MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), "Je hebt &euro;"+InvoiceData.amount+" betaald!", "#badc58", 1500);
});

MI.Phone.Functions.LoadBankInvoices = function(invoices) {
    if (invoices !== null) {
        $(".bank-app-invoices-list").html("");

        $.each(invoices, function(i, invoice){
            var Elem = '<div class="bank-app-invoice" id="invoiceid-'+invoice.id+'"> <div class="bank-app-invoice-title">'+ invoice.label +' <span style="font-size: 1vh; color: gray;">(Gönderen: '+invoice.number+')</span></div> <div class="bank-app-invoice-amount">$ '+invoice.amount+'</div> <div class="bank-app-invoice-buttons"> <i class="fas fa-check-circle pay-invoice"></i></div> </div>';
  
            $(".bank-app-invoices-list").append(Elem);
            $("#invoiceid-"+invoice.id).data('invoicedata', invoice);
        });
    }
}

MI.Phone.Functions.LoadContactsWithNumber = function(myContacts) {
    var ContactsObject = $(".bank-app-my-contacts-list");
    $(ContactsObject).html("");
    var TotalContacts = 0;

    $("#bank-app-my-contact-search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".bank-app-my-contacts-list .bank-app-my-contact").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    if (myContacts !== null) {
        $.each(myContacts, function(i, contact){
            var RandomNumber = Math.floor(Math.random() * 6);
            var ContactColor = MI.Phone.ContactColors[RandomNumber];
            var ContactElement = '<div class="bank-app-my-contact" data-bankcontactid="'+i+'"> <div class="bank-app-my-contact-firstletter">'+((contact.name).charAt(0)).toUpperCase()+'</div> <div class="bank-app-my-contact-name">'+contact.name+'</div> </div>'
            TotalContacts = TotalContacts + 1
            $(ContactsObject).append(ContactElement);
            $("[data-bankcontactid='"+i+"']").data('contactData', contact);
        });
    }
};

$(document).on('click', '.bank-app-my-contacts-list-back', function(e){
    e.preventDefault();

    MI.Phone.Animations.TopSlideUp(".bank-app-my-contacts", 400, -100);
});

$(document).on('click', '.bank-transfer-mycontacts-icon', function(e){
    e.preventDefault();

    MI.Phone.Animations.TopSlideDown(".bank-app-my-contacts", 400, 0);
});

$(document).on('click', '.bank-app-my-contact', function(e){
    e.preventDefault();
    var PressedContactData = $(this).data('contactData');

    if (PressedContactData.iban !== "" && PressedContactData.iban !== undefined && PressedContactData.iban !== null) {
        $("#bank-transfer-iban").val(PressedContactData.iban);
    } else {
        MI.Phone.Notifications.Add("fas fa-university", MI.Phone.Functions.Lang("BANK_TITLE"), MI.Phone.Functions.Lang("BANK_NOIBAN"), "#badc58", 2500);
    }
    MI.Phone.Animations.TopSlideUp(".bank-app-my-contacts", 400, -100);
});


//**** CYRPTO


var SelectedCryptoTab = Config.DefaultCryptoPage;
var ActionTab = null;
$(".cryptotab-"+SelectedCryptoTab).css({"display":"block"});
$(".crypto-header-footer").find('[data-cryptotab="'+SelectedCryptoTab+'"]').addClass('crypto-header-footer-item-selected');

var CryptoData = [];
CryptoData.Portfolio = 0;
CryptoData.Worth = 1000;
CryptoData.WalletId = null;
CryptoData.History = [];

function SetupCryptoData(Crypto) {
    CryptoData.History = Crypto.History;
    CryptoData.Portfolio = (Crypto.Portfolio).toFixed(6);
    CryptoData.Worth = Crypto.Worth;
    CryptoData.WalletId = Crypto.WalletId;

    $(".crypto-action-page-wallet").html("Portefeuille: "+CryptoData.Portfolio+" Qbit('s)");
    $(".crypto-walletid").html(CryptoData.WalletId);
    $(".cryptotab-course-list").html("");
    if (CryptoData.History.length > 0) {
        CryptoData.History = CryptoData.History.reverse();
        $.each(CryptoData.History, function(i, change){
            var PercentageChange = ((change.NewWorth - change.PreviousWorth) / change.PreviousWorth) * 100;
            var PercentageElement = '<span style="color: green;" class="crypto-percentage-change"><i style="color: green; transform: rotate(-45deg);" class="fas fa-arrow-right"></i> +('+Math.ceil(PercentageChange)+'%)</span>';
            if (PercentageChange < 0 ) {
                PercentageChange = (PercentageChange * -1);
                PercentageElement = '<span style="color: red;" class="crypto-percentage-change"><i style="color: red; transform: rotate(125deg);" class="fas fa-arrow-right"></i> -('+Math.ceil(PercentageChange)+'%)</span>';
            }
            var Element =   '<div class="cryptotab-course-block">' +
                                '<i class="fas fa-exchange-alt"></i>' +
                                '<span class="cryptotab-course-block-title">Koers verandering</span>' +
                                '<span class="cryptotab-course-block-happening"><span style="font-size: 1.3vh;">€'+change.PreviousWorth+'</span> naar <span style="font-size: 1.3vh;">€'+change.NewWorth+'</span>'+PercentageElement+'</span>' +
                            '</div>';
    
            $(".cryptotab-course-list").append(Element);                
        });
    }

    $(".crypto-portofolio").find('p').html(CryptoData.Portfolio);
    $(".crypto-course").find('p').html("€"+CryptoData.Worth);
    $(".crypto-volume").find('p').html("€"+Math.ceil(CryptoData.Portfolio * CryptoData.Worth));
}

function UpdateCryptoData(Crypto) {
    CryptoData.History = Crypto.History;
    CryptoData.Portfolio = (Crypto.Portfolio).toFixed(6);
    CryptoData.Worth = Crypto.Worth;
    CryptoData.WalletId = Crypto.WalletId;

    $(".crypto-action-page-wallet").html("Portefeuille: "+CryptoData.Portfolio+" Qbit('s)");
    $(".crypto-walletid").html(CryptoData.WalletId);
    $(".cryptotab-course-list").html("");
    if (CryptoData.History.length > 0) {
        CryptoData.History = CryptoData.History.reverse();
        $.each(CryptoData.History, function(i, change){
            var PercentageChange = ((change.NewWorth - change.PreviousWorth) / change.PreviousWorth) * 100;
            var PercentageElement = '<span style="color: green;" class="crypto-percentage-change"><i style="color: green; transform: rotate(-45deg);" class="fas fa-arrow-right"></i> +('+Math.ceil(PercentageChange)+'%)</span>';
            if (PercentageChange < 0 ) {
                PercentageChange = (PercentageChange * -1);
                PercentageElement = '<span style="color: red;" class="crypto-percentage-change"><i style="color: red; transform: rotate(125deg);" class="fas fa-arrow-right"></i> -('+Math.ceil(PercentageChange)+'%)</span>';
            }
            var Element =   '<div class="cryptotab-course-block">' +
                                '<i class="fas fa-exchange-alt"></i>' +
                                '<span class="cryptotab-course-block-title">Koers verandering</span>' +
                                '<span class="cryptotab-course-block-happening"><span style="font-size: 1.3vh;">€'+change.PreviousWorth+'</span> naar <span style="font-size: 1.3vh;">€'+change.NewWorth+'</span>'+PercentageElement+'</span>' +
                            '</div>';
    
            $(".cryptotab-course-list").append(Element);                
        });
    }

    $(".crypto-portofolio").find('p').html(CryptoData.Portfolio);
    $(".crypto-course").find('p').html("€"+CryptoData.Worth);
    $(".crypto-volume").find('p').html("€"+Math.ceil(CryptoData.Portfolio * CryptoData.Worth));
}

function RefreshCryptoTransactions(data) {
    $(".cryptotab-transactions-list").html("");
    if (data.CryptoTransactions.length > 0) {
        data.CryptoTransactions = (data.CryptoTransactions).reverse();
        $.each(data.CryptoTransactions, function(i, transaction){
            var Title = "<span style='color: green;'>"+transaction.TransactionTitle+"</span>"
            if (transaction.TransactionTitle == "Afschrijving") {
                Title = "<span style='color: red;'>"+transaction.TransactionTitle+"</span>"
            }
            var Element = '<div class="cryptotab-transactions-block"> <i class="fas fa-exchange-alt"></i> <span class="cryptotab-transactions-block-title">'+Title+'</span> <span class="cryptotab-transactions-block-happening">'+transaction.TransactionMessage+'</span></div>';
            
            $(".cryptotab-transactions-list").append(Element);                
        });
    }
}

$(document).on('click', '.crypto-header-footer-item', function(e){
    e.preventDefault();

    var CurrentTab = $(".crypto-header-footer").find('[data-cryptotab="'+SelectedCryptoTab+'"]');
    var SelectedTab = this;
    var HeaderTab = $(SelectedTab).data('cryptotab');

    if (HeaderTab !== SelectedCryptoTab) {
        $(CurrentTab).removeClass('crypto-header-footer-item-selected');
        $(SelectedTab).addClass('crypto-header-footer-item-selected');
        $(".cryptotab-"+SelectedCryptoTab).css({"display":"none"});
        $(".cryptotab-"+HeaderTab).css({"display":"block"});
        SelectedCryptoTab = $(SelectedTab).data('cryptotab');
    }
});

$(document).on('click', '.cryptotab-general-action', function(e){
    e.preventDefault();

    var Tab = $(this).data('action');

    $(".crypto-action-page").css({"display":"block"});
    $(".crypto-action-page").animate({
        left: 0,
    }, 300);
    $(".crypto-action-page-"+Tab).css({"display":"block"});
    MI.Phone.Functions.HeaderTextColor("black", 300);
    ActionTab = Tab;
});

$(document).on('click', '#cancel-crypto', function(e){
    e.preventDefault();

    $(".crypto-action-page").animate({
        left: -30+"vh",
    }, 300, function(){
        $(".crypto-action-page-"+ActionTab).css({"display":"none"});
        $(".crypto-action-page").css({"display":"none"});
        ActionTab = null;
    });
    MI.Phone.Functions.HeaderTextColor("white", 300);
});

function CloseCryptoPage() {
    $(".crypto-action-page").animate({
        left: -30+"vh",
    }, 300, function(){
        $(".crypto-action-page-"+ActionTab).css({"display":"none"});
        $(".crypto-action-page").css({"display":"none"});
        ActionTab = null;
    });
    MI.Phone.Functions.HeaderTextColor("white", 300);
}

$(document).on('click', '#buy-crypto', function(e){
    e.preventDefault();

    var Coins = $(".crypto-action-page-buy-crypto-input-coins").val();
    var Price = $(".crypto-action-page-buy-crypto-input-money").val();

    if ((Coins !== "") && (Price !== "")) {
        if (MI.Phone.Data.PlayerData.money.bank >= Price) {
            $.post('http://qb-phone_limited_edition/BuyCrypto', JSON.stringify({
                Coins: Coins,
                Price: Price,
            }), function(CryptoData){
                if (CryptoData !== false) {
                    UpdateCryptoData(CryptoData)
                    CloseCryptoPage()
                    MI.Phone.Data.PlayerData.money.bank = parseInt(MI.Phone.Data.PlayerData.money.bank) - parseInt(Price);
                    MI.Phone.Notifications.Add("fas fa-university", "bank", "Er is &euro; "+Price+",- afgeschreven!", "#badc58", 2500);
                } else {
                    MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Je hebt niet genoeg geld..", "#badc58", 1500);
                }
            });
        } else {
            MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Je hebt niet genoeg geld..", "#badc58", 1500);
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Vul alles in!", "#badc58", 1500);
    }
});

$(document).on('click', '#sell-crypto', function(e){
    e.preventDefault();

    var Coins = $(".crypto-action-page-sell-crypto-input-coins").val();
    var Price = $(".crypto-action-page-sell-crypto-input-money").val();

    if ((Coins !== "") && (Price !== "")) {
        if (CryptoData.Portfolio >= parseInt(Coins)) {
            $.post('http://qb-phone_limited_edition/SellCrypto', JSON.stringify({
                Coins: Coins,
                Price: Price,
            }), function(CryptoData){
                if (CryptoData !== false) {
                    UpdateCryptoData(CryptoData)
                    CloseCryptoPage()
                    MI.Phone.Data.PlayerData.money.bank = parseInt(MI.Phone.Data.PlayerData.money.bank) + parseInt(Price);
                    MI.Phone.Notifications.Add("fas fa-university", "bank", "Er is &euro; "+Price+",- bijgeschreven!", "#badc58", 2500);
                } else {
                    MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Je hebt niet genoeg Qbits..", "#badc58", 1500);
                }
            });
        } else {
            MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Je hebt niet genoeg Qbits..", "#badc58", 1500);
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Vul alles in!", "#badc58", 1500);
    }
});

$(document).on('click', '#transfer-crypto', function(e){
    e.preventDefault();

    var Coins = $(".crypto-action-page-transfer-crypto-input-coins").val();
    var WalletId = $(".crypto-action-page-transfer-crypto-input-walletid").val();

    if ((Coins !== "") && (WalletId !== "")) {
        if (CryptoData.Portfolio >= Coins) {
            if (WalletId !== CryptoData.WalletId) {
                $.post('http://qb-phone_limited_edition/TransferCrypto', JSON.stringify({
                    Coins: Coins,
                    WalletId: WalletId,
                }), function(CryptoData){
                    if (CryptoData == "notenough") {
                        MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Je hebt niet genoeg Qbits..", "#badc58", 1500);
                    } else if (CryptoData == "notvalid") {
                        MI.Phone.Notifications.Add("fas fa-university", "Crypto", "Dit Wallet-ID bestaat niet!", "#badc58", 2500);
                    } else {
                        UpdateCryptoData(CryptoData)
                        CloseCryptoPage()
                        MI.Phone.Notifications.Add("fas fa-university", "Crypto", "Je hebt "+Coins+",- overgemaakt naar "+WalletId+"!", "#badc58", 2500);
                    }
                });
            } else {
                MI.Phone.Notifications.Add("fas fa-university", "Crypto", "Je kan niet naar jezelf overmaken..", "#badc58", 2500);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Je hebt niet genoeg Qbits..", "#badc58", 1500);
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-chart-pie", "Crypto", "Vul alles in!", "#badc58", 1500);
    }
});

$(".crypto-action-page-buy-crypto-input-money").keyup(function(){
    var MoneyInput = this.value

    $(".crypto-action-page-buy-crypto-input-coins").val((MoneyInput / CryptoData.Worth).toFixed(6));
}); 

$(".crypto-action-page-buy-crypto-input-coins").keyup(function(){
    var MoneyInput = this.value

    $(".crypto-action-page-buy-crypto-input-money").val(Math.ceil(CryptoData.Worth * MoneyInput));
});

$(".crypto-action-page-sell-crypto-input-money").keyup(function(){
    var MoneyInput = this.value

    $(".crypto-action-page-sell-crypto-input-coins").val((MoneyInput / CryptoData.Worth).toFixed(6));
}); 

$(".crypto-action-page-sell-crypto-input-coins").keyup(function(){
    var MoneyInput = this.value

    $(".crypto-action-page-sell-crypto-input-money").val(Math.ceil(CryptoData.Worth * MoneyInput));
});

////   DarkwebList


SetupBM = function(data) { 

$(".blackmarket2-list").html("");
	
 
    if (data != null) {
        $.each(data, function(id, veri){
 
            var Element = `<div onclick="buybm('${veri.name}', '${id}', '${veri.price}')" class="blackmarket-list" id="blackmarket-${id}">  <div class="blackmarket-list-fullname">${veri.label} </div><div class="blackmarket-span" style="float:right;color:green"> ${veri.price}$</div> </div>`;
 
            $(".blackmarket2-list").append(Element);
        });
    }
}
 
function buybm(x, i, z) { 

$("#blackmarket-"+i).css("display","none"); 

$.post("http://s4-phone/buybm", JSON.stringify({ x: x, price: z }));

MI.Phone.Notifications.Add("fas fa-skull-crossbones", 'Darkweb', 'İşleme alındı.');
}

SetupDarkweb = function(data) {
    $(".darkweb2-list").html("");
    $(".darkweb2-list").css({"left": "30vh"});
    $(".darkweb-header").css({"display": "none"});
    $(".darkweb-header").css({"left": "30vh"});
    AnimationDarkweb();
    setTimeout(function(){
        $(".darkweb-header").animate({left:0+"vh"}, 300).css({"display": "block"});
        if (data.length > 0) {
            $.each(data, function(i, darkweb){
                var element = '<div class="darkweb-list" id="darkwebid-'+i+'"> <div class="darkweb-list-firstletter">' + '<img src="img/darkweb/' + darkweb.item + '.png"' + 'width="70vh" height="70vh" style="border-radius:50%">' + '</div> <div class="darkweb-list-fullname">' + darkweb.label + '</div> <div class="darkweb-list-price">$' + darkweb.price + '</div> <input type="number" id = "' + 'darkweb' + i + '"class="darkweb-list-count" placeholder="0" required spellcheck="false"> <div class="darkweb-list-call"><i class="fas fa-shopping-cart"></i></div> </div>'
                darkweb.id = i;
                $(".darkweb2-list").animate({left:0+"vh"}, 300).append(element);
                $("#darkwebid-"+i).data('darkwebData', darkweb);
            });
        } else {
            var element = '<div class="darkweb-list"><div class="no-darkweb">Satılan hiç bir ürün yok.</div></div>'
            $(".darkweb2-list").append(element);
        }
    }, 2900)
}

AnimationDarkweb = function() {
    $(".darkweb-logo").css({"left": "0vh"});
    $("#darkweb-text").css({"opacity":"0.0", "left":"9vh"});
    $(".darkweb-app-loading").css({
        "display":"block",
        "left":"0vh",
    });
    setTimeout(function(){
        CurrentTab = "accounts";
        $(".darkweb-logo").animate({
            left: -12+"vh"
        }, 500);
        setTimeout(function(){
            $("#darkweb-text").animate({
                opacity: 1.0,
                left: 14+"vh"
            });
        }, 100);
        setTimeout(function(){
            $(".darkweb-app-loaded").css({"display":"block"}).animate({"padding-left":"0"}, 300);
            $(".darkweb-app-accounts").animate({left:0+"vh"}, 300);
            $(".darkweb-app-loading").animate({
                left: -30+"vh"
            },300, function(){
                $(".darkweb-app-loading").css({"display":"none"});
            });
        }, 1500)
    }, 500)
}

$(document).on('click', '.darkweb-list-call', function(e){
    e.preventDefault();

    var darkwebData = $(this).parent().data('darkwebData');
    var orderCount = Number($("#darkweb" + darkwebData.id).val());
    
    if (orderCount != "" && orderCount > 0) {
        $.post('http://s4-phone/DarkwebOrder', JSON.stringify({
            Item: darkwebData.item,
            Label: darkwebData.label,
            Price: darkwebData.price,
            Count: orderCount,
        }), function(status){
            if (status) {
                MI.Phone.Notifications.Add("fas fa-skull-crossbones", 'Darkweb', 'Sipariş verildi.', "#27ae60");
            } else {
                MI.Phone.Notifications.Add("fas fa-skull-crossbones", 'Darkweb', 'Yeterli paraya sahip değilsin.');
            }
        });
    } else {
        MI.Phone.Notifications.Add("fas fa-skull-crossbones", 'Darkweb', 'Miktar girmediniz.');
    }
});


///// DOCTOR

SetupDoctor = function(data) {
    $(".doctor2-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, doctor){
            var element = '<div class="doctor-list" id="doctorid-'+i+'"> <div class="doctor-list-firstletter">' + (doctor.firstname).charAt(0).toUpperCase() + '</div> <div class="doctor-list-fullname">' + doctor.firstname + ' ' + doctor.lastname + '</div> <div class="doctor-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".doctor2-list").append(element);
            $("#doctorid-"+i).data('doctorData', doctor);
        });
    } else {
        var element = '<div class="doctor-list"><div class="no-doctor">Müsait bir doktor bulunamadı...</div></div>'
        $(".doctor2-list").append(element);
    }
}

$(document).on('click', '.doctor-list-call', function(e){
    e.preventDefault();

    var doctorData = $(this).parent().data('doctorData');
    
    var cData = {
        number: doctorData.phone,
        name: doctorData.name
    }

    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (MI.Phone.Data.AnonymousCall) {
                            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_STARTED_ANON"));
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        MI.Phone.Functions.HeaderTextColor("white", 400);
                        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".doctor-app").css({"display":"none"});
                            MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            MI.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        MI.Phone.Data.currentApplication = "phone-call";
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                //MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});

///// FOOOD

SetupFood = function(data) {
    $(".food2-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, food){
            var element = '<div class="food-list" id="foodid-'+i+'"> <div class="food-list-firstletter">' + '<img src="img/' + food.setjob + '.png"' + 'width="50vh" height="50vh" style="border-radius:50%">' + '</div> <div class="food-list-fullname">' + food.name + '</div> <div class="food-list-company"><i class="fas fa-arrow-circle-right"></i></div> </div>'
            $(".food2-list").append(element);
            $("#foodid-"+i).data('foodData', food);
        });
    } else {
        var element = '<div class="food-list"><div class="no-food">Şuanda müsait restorant yok..</div></div> <div class="food-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
        $(".food2-list").append(element);
    }
}

$(document).on('click', '.food-list-back', function(e){
    $.post('http://s4-phone/GetCurrentFoodCompany', JSON.stringify({}), function(data){
        SetupFood(data);
    });	
});

$(document).on('click', '.food-list-company', function(e){
    var foodData = $(this).parent().data('foodData');

    $.post('http://s4-phone/GetCurrentFoodWorker', JSON.stringify({
        FoodJob: foodData.setjob,
    }), function(status){
        $(".food2-list").html("");
        if (status.length > 0) {
            $.each(status, function(i, food){
                var element = '<div class="food-list" id="foodid-'+i+'"> <div class="food-list-firstletter-worker">' + (food.name).charAt(0).toUpperCase() + '</div><div class="food-list-fullname">' + food.name + '</div> <div class="food-list-call"><i class="fas fa-phone"></i></div> </div>'
                $(".food2-list").append(element);
                $("#foodid-"+i).data('foodData', food);
            });
            var back = '<div class="food-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
            $(".food2-list").append(back);
        } else {
            var element = '<div class="food-list"><div class="no-food">Bu restoran şu anda hizmet vermiyor...</div></div> <div class="food-list-back"><i class="fas fa-arrow-circle-left"></i></div> </div>'
            $(".food2-list").append(element);
        }
    });
});

$(document).on('click', '.food-list-call', function(e){
    e.preventDefault();

    var foodData = $(this).parent().data('foodData');
    
    var cData = {
        number: foodData.phone,
        name: foodData.name
    }

    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (MI.Phone.Data.AnonymousCall) {
                            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_STARTED_ANON"));
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        MI.Phone.Functions.HeaderTextColor("white", 400);
                        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".food-app").css({"display":"none"});
                            MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            MI.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        MI.Phone.Data.currentApplication = "phone-call";
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
               //MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});


//// GALERİ


SetupEMS = function(EMS) {
	
	
    $("#emslist").html("");
	
	
    if (EMS != null) {
		
		 EMS = (EMS).reverse();
      $.each(EMS, function(id, em){
      var bordr = "";
	  if(id == 0) { bordr = `style="border: 1px solid red;"`;  }
 
       var Element = `<div class="ems-s" ${bordr} onclick="setwp('${em.x}', '${em.y}')">
	  <span class="ems-img" style="	background: url(img/apps/emss.png);  background-size: cover;"></span>
      <span class="ems-name">YARDIM TALEBİ </span>
	 </div>`;
			$("#emslist").append(Element);
        });
    }
}


function setwp(x,y) { MI.Phone.Notifications.Add("fas fa-check-circle", "EMS", " Konum işaretlendi." );  $.post("http://s4-phone/setwp", JSON.stringify({ x: x , y:y  }));  }

ResimleriGetir = function(Resimler) {
    $(".grid2-container").html("");
	
	
    if (Resimler != null) {
        $.each(Resimler, function(id, resim){
 
 
            var Element = `<div class="grid2-item" id="g_${resim.id}"  style="margin-left: 1px;"><a href="javascript:goster('${resim.id}');"><div id="p_${resim.id}" style="background:url(${resim.resim});     background-size: cover;background-position: 20%;" class="img" ></div></a></div>`;
            $(".grid2-container").append(Element);
        });
    }
}
 
 
 


function goster(x) {
    simdiki_id = x;
    document.getElementById("photoShow").style.right = "0%";
    document.getElementById("imgS").style.background = document.getElementById("p_"+x).style.background;
    document.getElementById("imgS").style.backgroundSize = document.getElementById("p_"+x).style.backgroundSize;
    document.getElementById("imgS").style.backgroundPosition = document.getElementById("p_"+x).style.backgroundPosition;
}





function kapat2() {
 
 	
 document.getElementById("photoShow").style.right = "-120%";

}

function sil() {
	 
	 $("#g_"+simdiki_id).remove();
     $.post("http://s4-phone/ResimSil", JSON.stringify({ resim_url: simdiki_id   })); 
	 MI.Phone.Notifications.Add("fas fa-check-circle", "Galeri", " Fotoğraf Silindi." )
	 kapat2();
}


////// GARAGE

$(document).on('click', '.garage-vehicle', function(e){
    e.preventDefault();

    $(".garage-homescreen").animate({
        left: 30+"vh"
    }, 200);
    $(".garage-detailscreen").animate({
        left: 0+"vh"
    }, 200);

    var Id = $(this).attr('id');
    var VehData = $("#"+Id).data('VehicleData');
    SetupDetails(VehData);  
});

$(document).on('click', '.garage-cardetails-footer', function(e){
    e.preventDefault();

    $(".garage-homescreen").animate({
        left: 00+"vh"
    }, 200);
    $(".garage-detailscreen").animate({
        left: -30+"vh"
    }, 200);
});

SetupGarageVehicles = function(Vehicles) {
    $(".garage-vehicles").html("");
    if (Vehicles != null) {
        $.each(Vehicles, function(i, vehicle){
            var Element = '<div class="garage-vehicle" id="vehicle-'+i+'"> <span class="garage-vehicle-firstletter">'+vehicle.brand.charAt(0)+'</span> <span class="garage-vehicle-name">'+vehicle.fullname+'</span> </div>';
            
            $(".garage-vehicles").append(Element);
            $("#vehicle-"+i).data('VehicleData', vehicle);
        });
    }
}

var sonArac = null;
var sonCagirilan = null;

SetupDetails = function(data) {
    $(".vehicle-brand").find(".vehicle-answer").html(data.brand);
    $(".vehicle-model").find(".vehicle-answer").html(data.model);
    $(".vehicle-plate").find(".vehicle-answer").html(data.plate);
    $(".vehicle-garage").find(".vehicle-answer").html(data.garage);
    $(".vehicle-status").find(".vehicle-answer").html(data.state);
    $(".vehicle-fuel").find(".vehicle-answer").html(Math.ceil(data.fuel)+"%");
    $(".vehicle-engine").find(".vehicle-answer").html(Math.ceil(data.engine / 10)+"%");
    $(".vehicle-body").find(".vehicle-answer").html(Math.ceil(data.body / 10)+"%");
}



$(document).on('click', '.garage-vale-footer', function(e){
    e.preventDefault();
	sonCagirilan = sonArac;
    $.post("http://s4-phone/ValeCagir", JSON.stringify({ plaka: sonCagirilan  })); 
    $(".garage-homescreen").animate({
        left: 00+"vh"
    }, 200);
    $(".garage-detailscreen").animate({
        left: -30+"vh"
    }, 200);
});

/// HAVA DURUMU

MI.Phone.Functions.DoHavaDurumuOpen = function(data) { 
 var simdiki = data.simdikizaman;
 var sonraki = data.birsonraki;
 //$(".havadurumu-durum").css({"background-position":""+HavaDurumuPozisyonCek(simdiki)+""});
 $(".drm").val(HavaDurumuCevirisi(simdiki));
 //$(".havadurumu-durum2").css({"background-position":""+HavaDurumuPozisyonCek(sonraki)+""});
 $(".drm2").val(HavaDurumuCevirisi(sonraki));
 data.derece = Math.round(data.derece);
 $(".los_santos").html("Los santos "+data.derece+"°");
 $(".derece").html(data.derece+"°");
 
 
 
 var veri = HavaDurumuPozisyonCek(simdiki);
 var veri2 = HavaDurumuPozisyonCek(sonraki);
 $(".havadurumu-durum").css({"background":"url(../html/img/app_details/weather-icons.png) "+veri.pos+" ", "width": veri.width, "height": veri.height  });
 $(".havadurumu-durum2").css({"background":"url(../html/img/app_details/weather-icons.png) "+veri2.pos+" ", "width": veri2.width, "height": veri2.height  });
 
}



function HavaDurumuPozisyonCek(x) {
	var veri = {}
	if(x == "RAIN") { veri.pos = "no-repeat -1130px -44px"; veri.width = "67px"; veri.height = "65px";	 }
	else if(x == "THUNDER") { veri.pos = "no-repeat -372px -44px"; veri.width = "67px"; veri.height = "59px"; }
	else if(x == "CLEARING") { veri.pos = "no-repeat -1132px -208px"; veri.width = "63px"; veri.height = "41px"; }
	else if(x == "CLEAR") { veri.pos = "no-repeat -222px -504px"; veri.width = "63px"; veri.height = "41px"; }
	else if(x == "EXTRASUNNY") {  veri.pos = "no-repeat -688px -358px"; veri.width = "41px"; veri.height = "41px";  }
	else if(x == "CLOUDS") {  veri.pos = " no-repeat -825px -508px"; veri.width = "70px"; veri.height = "40px";  }
	else if(x == "OVERCAST") {  veri.pos = "no-repeat -1130px -507px"; veri.width = "67px"; veri.height = "66px"; }
	else if(x == "SMOG") { veri.pos = "no-repeat -220px -205px"; veri.width = "67px"; veri.height = "45px"; }
	else if(x == "FOGGY") { veri.pos = "no-repeat -383px -360px"; veri.width = "43px"; veri.height = "43px"; }
	else if(x == "XMAS") { veri.pos = "no-repeat -1282px -199px"; veri.width = "67px"; veri.height = "73px"; }
	else if(x == "SNOWLIGHT") { veri.pos = "no-repeat -1130px -507px"; veri.width = "67px"; veri.height = "66px"; }
	else if(x == "BLIZZARD") { veri.pos = "no-repeat -220px -356px"; veri.width = "67px"; veri.height = "63px"; }
	else if(x == "BILINMIYOR") { veri.pos = "no-repeat -675px -206px"; veri.width = "67px"; veri.height = "37px"; }else { veri.pos = "no-repeat -675px -206px"; veri.width = "67px"; veri.height = "37px"; }
	return veri
}

function HavaDurumuCevirisi(x) {
	if(x == "RAIN") { x = "Yağmurlu"; }
	else if(x == "THUNDER") { x = "Sağanak Yağışlı"; }
	else if(x == "CLEARING") { x = "Parçalı Bulutlu"; }
	else if(x == "CLEAR") { x = "Az Bulutlu"; }
	else if(x == "EXTRASUNNY") { x = "Açık"; }
	else if(x == "CLOUDS") { x = "Çok Bulutlu"; }
	else if(x == "OVERCAST") { x = "Çok Bulutlu"; }
	else if(x == "SMOG") { x = "Dumanlı"; }
	else if(x == "FOGGY") { x = "Sisli"; }
	else if(x == "XMAS") { x = "XMAS"; }
	else if(x == "SNOWLIGHT") { x = "Kar Yağışlı"; }
	else if(x == "BLIZZARD") { x = "Kar fırtınası"; }
	else if(x == "BILINMIYOR") { x = "Bilinmiyor"; }else { x = "N/A Bilinmiyor"; }
	return x
}


/// HOUSES 

var SelectedHousesTab = "myhouses";
var CurrentHouseData = {};
var HousesData = {};

$(document).on('click', '.houses-app-header-tab', function(e){
    e.preventDefault();
    var CurrentHouseTab = $("[data-housetab='"+SelectedHousesTab+"']");
    var Data = $(this).data('housetab');

    if (Data !== SelectedHousesTab) {
        $(".house-app-" + $(CurrentHouseTab).data('housetab') + "-container").css("display", "none");
        $(".house-app-" + Data + "-container").css("display", "block");
        $(CurrentHouseTab).removeClass('houses-app-header-tab-selected');
        $("[data-housetab='"+Data+"']").addClass('houses-app-header-tab-selected');
        SelectedHousesTab = Data
    }
});

$(document).on('click', '.myhouses-house', function(e){
    e.preventDefault();

    var HouseData = $(this).data('HouseData');
    CurrentHouseData = HouseData;
    $(".myhouses-options-container").fadeIn(150);
    $(".myhouses-options-header").html(HouseData.label);
});

$(document).on('click', '#myhouse-option-close', function(e){
    e.preventDefault();

    $(".myhouses-options-container").fadeOut(150);
});

function SetupPlayerHouses(Houses) {
    HousesData = Houses;
    $(".house-app-myhouses-container").html("");
    if (Houses.length > 0) {
        $.each(Houses, function(id, house){
            var TotalKeyholders = 0;
           
            if (house.keyholders !== undefined && house.keyholders !== null) {
                TotalKeyholders = (house.keyholders).length;
            }
            var HouseDetails = '<i class="fas fa-key"></i>&nbsp;&nbsp;' + TotalKeyholders + '&nbsp&nbsp&nbsp&nbsp<i class="fas fa-warehouse"></i>&nbsp;&nbsp;&nbsp;<i class="fas fa-times"></i>';
            if (house.garage.length > 0) {
                HouseDetails = '<i class="fas fa-key"></i>&nbsp;&nbsp;' + TotalKeyholders + '&nbsp&nbsp&nbsp&nbsp<i class="fas fa-warehouse"></i>&nbsp;&nbsp;&nbsp;<i class="fas fa-check"></i>';
            }
            var elem = '<div class="myhouses-house" id="house-' + id + '"><div class="myhouse-house-icon"><i class="fas fa-home"></i></div> <div class="myhouse-house-titel">' + house.label + ' | Tier ' + house.tier + '</div> <div class="myhouse-house-details">' + HouseDetails + '</div> </div>';
            $(".house-app-myhouses-container").append(elem);
            $("#house-" + id).data('HouseData', house)
        });
    }
}

var AnimationDuration = 200;

$(document).on('click', '#myhouse-option-transfer', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: -35+"vw"
    }, AnimationDuration);

    $(".myhouse-option-transfer-container").animate({
        left: 0
    }, AnimationDuration);
});

$(document).on('click', '#myhouse-option-keys', function(e){
    if (CurrentHouseData.keyholders !== undefined && CurrentHouseData.keyholders !== null) {
        $.each(CurrentHouseData.keyholders, function(i, keyholder){
            if (keyholder !== null && keyholder !== undefined) {
                var elem;
                if (keyholder.charinfo.firstname !== QB.Phone.Data.PlayerData.charinfo.firstname && keyholder.charinfo.lastname !== QB.Phone.Data.PlayerData.charinfo.lastname) {
                    elem = '<div class="house-key" id="holder-'+i+'"><span class="house-key-holder">' + keyholder.charinfo.firstname + ' ' + keyholder.charinfo.lastname + '</span> <div class="house-key-delete"><i class="fas fa-trash"></i></div> </div>';
                } else {
                    elem = '<div class="house-key" id="holder-'+i+'"><span class="house-key-holder">(Ik) ' + keyholder.charinfo.firstname + ' ' + keyholder.charinfo.lastname + '</span></div>';
                } 
                $(".keys-container").append(elem);
                $('#holder-' + i).data('KeyholderData', keyholder);
            }
        });
    }
    $(".myhouses-options").animate({
        left: -35+"vw"
    }, AnimationDuration);
    $(".myhouse-option-keys-container").animate({
        left: 0
    }, AnimationDuration);
});

$(document).on('click', '.house-key-delete', function(e){
    e.preventDefault();
    var Data = $(this).parent().data('KeyholderData');

    $.each(CurrentHouseData.keyholders, function(i, keyholder){
        if (Data.citizenid == keyholder.citizenid) {
            CurrentHouseData.keyholders.splice(i);
        }
    });

    $.each(HousesData, function(i, house){
        if (house.name == CurrentHouseData.name) {
            HousesData[i].keyholders = CurrentHouseData.keyholders;
        }
    });

    SetupPlayerHouses(HousesData);

    $(this).parent().fadeOut(250, function(){
        $(this).remove();
    });

    $.post('http://coderc-phone/RemoveKeyholder', JSON.stringify({
        HolderData: Data,
        HouseData: CurrentHouseData,
    }));
});

$(document).on('click', '#myhouse-option-transfer-confirm', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: 0
    }, AnimationDuration);

    $(".myhouse-option-transfer-container").animate({
        left: 35+"vw"
    }, AnimationDuration);
});

$(document).on('click', '#myhouse-option-transfer-back', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: 0
    }, AnimationDuration);

    $(".myhouse-option-transfer-container").animate({
        left: 35+"vw"
    }, AnimationDuration);
});

$(document).on('click', '#myhouse-option-keys-back', function(e){
    e.preventDefault();

    $(".myhouses-options").animate({
        left: 0
    }, AnimationDuration);
    $(".myhouse-option-keys-container").animate({
        left: 35+"vw"
    }, AnimationDuration);
});

/// INSTAGGRAM


function getirResim(owner) {
	 
	if (owner === undefined) { 
	 MI.Phone.Notifications.Add("fas fa-check-circle", "Instagram uygulaması yanıt vermiyor.", "Telefonunuzu yeniden başlatmayı deneyin." );
	 uygulama_kapat();
	}else if(owner == "undefined") {
	 MI.Phone.Notifications.Add("fas fa-check-circle", "Instagram uygulaması yanıt vermiyor.", "Telefonunuzu yeniden başlatmayı deneyin." );
	 uygulama_kapat();
	}else {
		
	$.post('http://s4-phone/GetirinstaProfilBilgi', JSON.stringify({owner: owner}), function(Bilgiler){
          $("#insta-kadi").val(Bilgiler.username);
		  
		  if(Bilgiler.biyografi != null &&  Bilgiler.biyografi != "") {
			  $("#insta-biyo").val(Bilgiler.biyografi);
			   $("#insta-biyo2").val(Bilgiler.biyografi);
		  }else {
			  $("#insta-biyo").val("Biyografi yok!");
			  $("#insta-biyo2").val("Biyografi yok!");
		  }
		  
		  
		  if(Bilgiler.profilepicture == "default"){
			 $("#insta-profil-fotosu").attr("src","./img/default.png");
		  }else {
			 $("#insta-profil-fotosu").attr("src", Bilgiler.profilepicture);
		  }
    });
	$.post('http://s4-phone/GetirinstaResimleri', JSON.stringify({owner: owner}), function(Resimler){
                ResimleriGetirinsta(Resimler);
    });
 
	$("#insta-profil").css("display", "block");
	}
}



ListeleHesaplar = function(Hesaplar) {
    $("#myTable").html(`
	
	<tr class="header" style="display:none;">
    <th style="width:60%;">&nbsp;</th>
    <th style="width:40%;">&nbsp;</th>
  </tr>
	
	`);
 
    if (Hesaplar != null) {
        $.each(Hesaplar, function(id, hesap){
            // ${resim.id}
	var takipbtn = `
	<a id="takip_${id}" href="javascript:takipet('${hesap.citizenid}', '${id}')" class="takipbtn">Takip et!</a>
	<a id="takipcik_${id}" href="javascript:taktencikar('${hesap.citizenid}', '${id}')" style="display:none;" class="takipcikbtn">Takibi bırak</a>
	
	`;
	if ( hesap.takip != null )	{
	  takipbtn = `
	<a id="takip_${id}" href="javascript:takipet('${hesap.citizenid}', '${id}')" style="display:none;" class="takipbtn">Takip et!</a>
	<a id="takipcik_${id}" href="javascript:taktencikar('${hesap.citizenid}', '${id}')"  class="takipcikbtn">Takibi bırak</a>
	
	`;
	} 
	
            var Element = `
		 
   <tr>
    <td>${hesap.username}</td>
		<td>${takipbtn}</td>
  </tr>

			
			`;
			
			
		if(hesap.citizenid != 	MI.Phone.Data.PlayerData.citizenid) { $("#myTable").append(Element); }
        });
    }
}

function takipet(x, y) {
	
$("#takip_"+y).css("display", "none");
$("#takipcik_"+y).css("display", "block");

$.post("http://s4-phone/Takip_instagram", JSON.stringify({ takip:"1", takip_edilen: x   })); 
	

}


function guncelleinsta() {
	MI.Phone.Notifications.Add("fas fa-check-circle", "Instagram", "Biyografi güncellendi." );
	$.post("http://s4-phone/biyoguncelle", JSON.stringify({ biyografi: $("#insta-biyo2").val()   })); 
	
}

function taktencikar(x, y) {
	
$("#takip_"+y).css("display", "block");
$("#takipcik_"+y).css("display", "none");

$.post("http://s4-phone/Takip_instagram", JSON.stringify({ takip:"0", takip_edilen: x   })); 
	
}

ResimleriGetirinsta = function(Resimler) {
    $(".gridinsta-container").html("");
	
	$("#aktiviteyok").css("display", "unset");
    if (Resimler != null) {
        $.each(Resimler, function(id, resim){
            $("#aktiviteyok").css("display", "none");
            var Element = `
			<div class="gridinsta-item" id="g_${resim.id}"  style="margin-left: 1px;">
			<input type="text" id="owner_${resim.id}" value="${resim.owner}" style="display:none;" />
			<a href="javascript:gosterinsta('${resim.id}');"><div id="p_${resim.id}" style="background:url(${resim.resim});     filter:${resim.efekt};    background-size: cover;background-position: 20%;" class="img" ></div>
			</a></div>`;
			
			
			
			
            $(".gridinsta-container").append(Element);
        });
    }
}

Galerinsta = function(Resimler) {
    $(".gridinsta2-container").html("");
	
 
    if (Resimler != null) {
        $.each(Resimler, function(id, resim){
 
            var Element = `
			<div class="gridinsta2-item" id="gx_${resim.id}"  style="margin-left: 1px;">
 
			<a href="javascript:secinsta('${resim.id}');"><div id="px_${resim.id}" style="background:url(${resim.resim});     background-size: cover;background-position: 20%;" class="img" ></div>
			</a></div>`;
			
			
			
			
            $(".gridinsta2-container").append(Element);
        });
    }
}



Getirinstazamantuneli = function(Resimler) {
    $("#insta-timeline").html("");
	
 
    if (Resimler != null) {
        $.each(Resimler, function(id, resim){
            // ${resim.id}
			
		   
		  if(resim.profilepicture == undefined) { 
		     resim.profilepicture = "./img/default.png";
		  }
		  if(resim.profilepicture == "undefined") { 
		     resim.profilepicture = "./img/default.png";
		  }
		  if(resim.profilepicture == "default"){
			 resim.profilepicture = "./img/default.png";
		  } 
		  
            var Element = `
		 
<div class="insta-post">
<a href="javascript:getirResim('${resim.owner}')" style="color: black;" >
<table style="width:100%">
  <tr>
    <th><div class="insta-profil-img"style="    background: url(${resim.profilepicture});
    background-size: cover; " ></div></th>
    <th><input type="text" class="post2" value="${resim.username}" disabled /></th>
   
  </tr>
  </table>

</a>
<div class="insta-post-img" style="    background: url(${resim.resim});
    background-size: cover;  filter: ${resim.efekt}; " ></div>
<a class="i i-kalp" id="like_${resim.id}" href="javascript:like('${resim.id}');" style="margin-left:30px; background: url(../html/img/app_details/instagram_icons2.png) no-repeat -900px -947px;" ></a>
<input type="text"  value="${resim.yazi}" disabled />
</div>


			`;
			
			
			
			
             $("#insta-timeline").append(Element);
        });
    }
}

function Panelinsta(x) {
	$("#insta-aktivite").css("display", "none");
	$("#insta-profil").css("display", "none");
	$("#insta-paylas").css("display", "none");
	$("#insta-paylas2").css("display", "none");
	$("#insta-paylas3").css("display", "none");
	$("#insta-timeline").css("display", "none");
	$("#insta-ara").css("display", "none");
	$("#insta-ayar").css("display", "none");
	$("#insta-"+x).css("display", "block");
}


function like(x){
	$("#like_"+x).css("background", "url(../html/img/app_details/instagram_icons2.png) no-repeat -950px -947px");
	$("#like_"+x).attr("href", "javascript:unlike('"+x+"')")
}

function unlike(x) {
	$("#like_"+x).css("background", "url(../html/img/app_details/instagram_icons2.png) no-repeat -900px -947px");
	$("#like_"+x).attr("href", "javascript:like('"+x+"')")
}
 
var instasimdiki_id = null;
var eskiEfekt = null;
var eskiResim = null;

function efekt(x) {
 
    if(eskiEfekt != x) { document.getElementById("secilen_foto").style.filter = x;  } else { 
        
        
     
    Panelinsta("paylas3");
 
    document.getElementById("secilen_foto2").style.background = document.getElementById("px_"+eskiResim).style.background;
    document.getElementById("secilen_foto2").style.backgroundSize = document.getElementById("px_"+eskiResim).style.backgroundSize;
    document.getElementById("secilen_foto2").style.backgroundPosition = document.getElementById("px_"+eskiResim).style.backgroundPosition;
    document.getElementById("secilen_foto2").style.filter = eskiEfekt;
        
    }
 

    eskiEfekt = x;
}

function paylasinsta(){
	Panelinsta("paylas");
	MI.Phone.Notifications.Add("fas fa-check-circle", "Instagram", "Bir fotoğraf paylaşıldı." );
	$.post("http://s4-phone/PaylasInstaPost", JSON.stringify({ eskiResim: eskiResim, eskiEfekt: eskiEfekt, yazi: $("#paylastext").val()   })); 
	
}

function gosterinsta(x) {
    instasimdiki_id = x;
    document.getElementById("photoShowinsta").style.right = "0%";
    document.getElementById("imgSinsta").style.background = document.getElementById("p_"+x).style.background;
    document.getElementById("imgSinsta").style.backgroundSize = document.getElementById("p_"+x).style.backgroundSize;
    document.getElementById("imgSinsta").style.backgroundPosition = document.getElementById("p_"+x).style.backgroundPosition;
	document.getElementById("imgSinsta").style.filter = document.getElementById("p_"+x).style.filter;
	
	if(MI.Phone.Data.PlayerData.citizenid == $("#owner_"+x).val()) {
		$("#silinsta").css("display", "unset");
	}else {
		$("#silinsta").css("display", "none");
	}
 
}

function secinsta(x) {
	
	$("#insta-paylas").css("display", "none");
	$("#insta-paylas2").css("display", "block");
	
	document.getElementById("secilen_foto").style.background = document.getElementById("px_"+x).style.background;
    document.getElementById("secilen_foto").style.backgroundSize = document.getElementById("px_"+x).style.backgroundSize;
    document.getElementById("secilen_foto").style.backgroundPosition = document.getElementById("px_"+x).style.backgroundPosition;
	
	eskiResim = x;
	 
	
	var i ;
    for (i = 1; i < 9; i++) {
    
      document.getElementById("e"+i).style.background = document.getElementById("px_"+x).style.background;
      document.getElementById("e"+i).style.backgroundSize = "cover";
      document.getElementById("e"+i).style.backgroundPosition = "center";
    }
	
}

function kapat2insta() {
 
 	
 document.getElementById("photoShowinsta").style.right = "-120%";

}

function silinsta() {
	 $("#g_"+instasimdiki_id).remove();
     $.post("http://s4-phone/ResimSilinsta", JSON.stringify({ resim_url: instasimdiki_id   })); 
	 MI.Phone.Notifications.Add("fas fa-check-circle", "Instagram", "Paylaşım Silindi." )
	 kapat2insta();
}
// LAWYERS


SetupLawyers = function(data) {
    $(".lawyers-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, lawyer){
            var element = '<div class="lawyer-list" id="lawyerid-'+i+'"> <div class="lawyer-list-firstletter">'+ (lawyer.firstname).charAt(0).toUpperCase() + '</div> <div class="lawyer-list-fullname">' + lawyer.firstname + ' ' + lawyer.lastname + '</div> <div class="lawyer-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".lawyers-list").append(element);
            $("#lawyerid-"+i).data('LawyerData', lawyer);
        });
    } else {
        var element = '<div class="lawyer-list"><div class="no-lawyers">Şuada müsait avukat bulunmuyor.</div></div>'
        $(".lawyers-list").append(element);
    }
}

$(document).on('click', '.lawyer-list-call', function(e){
    e.preventDefault();

    var LawyerData = $(this).parent().data('LawyerData');
    
    var cData = {
        number: LawyerData.phone,
        name: LawyerData.name
    }

    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (MI.Phone.Data.AnonymousCall) {
                            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_STARTED_ANON"));
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        MI.Phone.Functions.HeaderTextColor("white", 400);
                        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".lawyers-app").css({"display":"none"});
                            MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            MI.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        MI.Phone.Data.currentApplication = "phone-call";
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                //MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});

// MAIL 


var OpenedMail = null;

$(document).on('click', '.mail', function(e){
    e.preventDefault();

    $(".mail-home").animate({
        left: 30+"vh"
    }, 300);
    $(".opened-mail").animate({
        left: 0+"vh"
    }, 300);

    var MailData = $("#"+$(this).attr('id')).data('MailData');
    MI.Phone.Functions.SetupMail(MailData);

    OpenedMail = $(this).attr('id');
});

$(document).on('click', '.mail-back', function(e){
    e.preventDefault();

    $(".mail-home").animate({
        left: 0+"vh"
    }, 300);
    $(".opened-mail").animate({
        left: -30+"vh"
    }, 300);
    OpenedMail = null;
});

$(document).on('click', '#accept-mail', function(e){
    e.preventDefault();
    var MailData = $("#"+OpenedMail).data('MailData');
    $.post('http://s4-phone/AcceptMailButton', JSON.stringify({
        buttonEvent: MailData.button.buttonEvent,
        buttonData: MailData.button.buttonData,
        mailId: MailData.mailid,
    }));
    $(".mail-home").animate({
        left: 0+"vh"
    }, 300);
    $(".opened-mail").animate({
        left: -30+"vh"
    }, 300);
});

$(document).on('click', '#remove-mail', function(e){
    e.preventDefault();
    var MailData = $("#"+OpenedMail).data('MailData');
    $.post('http://s4-phone/RemoveMail', JSON.stringify({
        mailId: MailData.mailid
    }));
    $(".mail-home").animate({
        left: 0+"vh"
    }, 300);
    $(".opened-mail").animate({
        left: -30+"vh"
    }, 300);
});

MI.Phone.Functions.SetupMails = function(Mails) {
    var NewDate = new Date();
    var NewHour = NewDate.getHours();
    var NewMinute = NewDate.getMinutes();
    var Minutessss = NewMinute;
    var Hourssssss = NewHour;
    if (NewHour < 10) {
        Hourssssss = "0" + Hourssssss;
    }
    if (NewMinute < 10) {
        Minutessss = "0" + NewMinute;
    }
    var MessageTime = Hourssssss + ":" + Minutessss;

    $("#mail-header-text").html(MI.Phone.Data.PlayerData.charinfo.firstname+"_"+MI.Phone.Data.PlayerData.charinfo.lastname);
    $("#mail-header-mail").html(MI.Phone.Data.PlayerData.charinfo.firstname+"_"+MI.Phone.Data.PlayerData.charinfo.lastname+"@gmail.com");
    if (Mails !== null && Mails !== undefined) {
        if (Mails.length > 0) {
            $(".mail-list").html("");
            $.each(Mails, function(i, mail){
                var date = new Date(mail.date);
                var DateString = date.getDay()+" "+MonthFormatting[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
                var element = '<div class="mail" id="mail-'+mail.mailid+'"><span class="mail-sender" style="font-weight: bold;">'+mail.sender+'</span> <div class="mail-text"><p>'+mail.message+'</p></div> <div class="mail-time">'+DateString+'</div></div>';
    
                $(".mail-list").append(element);
                $("#mail-"+mail.mailid).data('MailData', mail);
            });
        } else {
            $(".mail-list").html('<p class="nomails">Herhangi bir mail yok!</p>');
        }

    }
}

var MonthFormatting = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

MI.Phone.Functions.SetupMail = function(MailData) {
    var date = new Date(MailData.date);
    var DateString = date.getDay()+" "+MonthFormatting[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    $(".mail-subject").html("<p><span style='font-weight: bold;'>"+MailData.sender+"</span><br>"+MailData.subject+"</p>");
    $(".mail-date").html("<p>"+DateString+"</p>");
    $(".mail-content").html("<p>"+MailData.message+"</p>");
    $(".mail-image-media").html("<p style='font-weight: bold;'>Medya:</p>");
    if (MailData.messageUrl != null) {
        $(".mail-image").html("<img src="+MailData.messageUrl+" width='240vh' height='200vh' style='border-radius: 1vh;' </img>");
    }

    var AcceptElem = '<div class="opened-mail-footer-item" id="accept-mail"><i class="fas fa-check-circle mail-icon"></i></div>';
    var RemoveElem = '<div class="opened-mail-footer-item" id="remove-mail"><i class="fas fa-trash-alt mail-icon"></i></div>';

    $(".opened-mail-footer").html("");    

    if (MailData.button !== undefined && MailData.button !== null) {
        $(".opened-mail-footer").append(AcceptElem);
        $(".opened-mail-footer").append(RemoveElem);
        $(".opened-mail-footer-item").css({"width":"50%"});
    } else {
        $(".opened-mail-footer").append(RemoveElem);
        $(".opened-mail-footer-item").css({"width":"100%"});
    }
}

// Advert JS

$(document).on('click', '.test-slet', function(e){
    e.preventDefault();

    $(".advert-home").animate({
        left: 30+"vh"
    });
    $(".new-advert").animate({
        left: 0+"vh"
    });
});

$(document).on('click', '#new-advert-back', function(e){
    e.preventDefault();

    $(".advert-home").animate({
        left: 0+"vh"
    });
    $(".new-advert").animate({
        left: -30+"vh"
    });
});

var cekilmis_foto = null;

$(document).on('click', '#new-advert-submit', function(e){
    e.preventDefault();

    var Advert = $(".new-advert-textarea").val();

    if (Advert !== "") {
        $(".advert-home").animate({
            left: 0+"vh"
        });
        $(".new-advert").animate({
            left: -30+"vh"
        });
        $.post('http://s4-phone/PostAdvert', JSON.stringify({
            message: Advert,
			cekilmis_foto: cekilmis_foto
        }));
		
		
       
		
		setTimeout(function(){  
		
		$(".new-advert-textarea").val("");
		fotosil();

		$.post('http://s4-phone/LoadAdverts', JSON.stringify({}), function(Adverts){
             MI.Phone.Functions.RefreshAdverts(Adverts);
        });

		}, 500);

		
    } else {
        MI.Phone.Notifications.Add("fas fa-ad", MI.Phone.Functions.Lang("ADVERTISEMENT_TITLE"), MI.Phone.Functions.Lang("ADVERTISEMENT_EMPY"), "#ff8f1a", 2000);
    }
});




$(document).on('click', '#new-advert-foto', function(e){
    e.preventDefault();
	
	$.post('http://s4-phone/PostNewImage', JSON.stringify({}),
        function (url) {
			 $(".foto_advert").attr("src", url);
			 $(".foto_advert").css("display", "block");
			 $(".silgorsel").css("display", "block");
             cekilmis_foto = url;
        },
    );
	
	 MI.Phone.Functions.Close();
     
});

function fotosil(){
	
	cekilmis_foto = null;
	$(".foto_advert").css("display", "none");
	$(".silgorsel").css("display", "none");
	
}

MI.Phone.Functions.RefreshAdverts = function(Adverts) {
    $("#advert-header-name").html("@"+MI.Phone.Data.PlayerData.charinfo.firstname+"_"+MI.Phone.Data.PlayerData.charinfo.lastname+" | "+MI.Phone.Data.PlayerData.charinfo.phone);
 //   if (Adverts.length > 0 || Adverts.length == undefined) {
 //       $(".advert-list").html("");
 //       $.each(Adverts, function(i, advert){
 //           var element = '<div class="advert"><span class="advert-sender">'+advert.name+' | '+advert.number+'</span><p>'+advert.message+'</p></div>';
 //           $(".advert-list").append(element);
 //       });
 //   } else {
 //       $(".advert-list").html("");
 //       var element = '<div class="advert"><span class="advert-sender">Herhangi bir ilan yok!</span></div>';
 //       $(".advert-list").append(element);
 //   }
 
 
    $(".advert-list").html("");
	
	
    if (Adverts != null) {
        $.each(Adverts, function(id, advert){
 
            
			var resim = "";
			
			if(advert.resim != null) {
				resim = `<img src="${advert.resim}" style="width: 175px; margin-bottom: 10px;" />`; 
			}
			
            var Element = `
			<div class="advert">
               <span class="advert-sender">${advert.isim} | ${advert.telno}</span>
                <p>${advert.mesaj}</p>
				${resim}
             </div>
			`;


		   $(".advert-list").append(Element);
        });
    }
 
}

/// MECANO


SetupMecano = function(data) {
    $(".mecano2-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, mecano){
            var element = '<div class="mecano-list" id="mecanoid-'+i+'"> <div class="mecano-list-firstletter">' + (mecano.firstname).charAt(0).toUpperCase() + '</div> <div class="mecano-list-fullname">' + mecano.firstname + ' '+ mecano.lastname + '</div> <div class="mecano-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".mecano2-list").append(element);
            $("#mecanoid-"+i).data('mecanoData', mecano);
        });
    } else {
        var element = '<div class="mecano-list"><div class="no-mecano">Şuanda müsait mekanik yok..</div></div>'
        $(".mecano2-list").append(element);
    }
}

$(document).on('click', '.mecano-list-call', function(e){
    e.preventDefault();

    var mecanoData = $(this).parent().data('mecanoData');
    
    var cData = {
        number: mecanoData.phone,
        name: mecanoData.name
    }

    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (MI.Phone.Data.AnonymousCall) {
                            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_STARTED_ANON"));
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        MI.Phone.Functions.HeaderTextColor("white", 400);
                        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".mecano-app").css({"display":"none"});
                            MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            MI.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        MI.Phone.Data.currentApplication = "phone-call";
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                //MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});


// MEOS

var CurrentMeosPage = null;
var OpenedPerson = null;

$(document).on('click', '.meos-block', function(e){
    e.preventDefault();
    var PressedBlock = $(this).data('meosblock');
    OpenMeosPage(PressedBlock);
});

OpenMeosPage = function(page) {
    CurrentMeosPage = page;
    $(".meos-"+CurrentMeosPage+"-page").css({"display":"block"});
    $(".meos-homescreen").animate({
        left: 30+"vh"
    }, 200);
    $(".meos-tabs").animate({
        left: 0+"vh"
    }, 200, function(){
        $(".meos-tabs-footer").animate({
            bottom: 0,
        }, 200)
        if (CurrentMeosPage == "alerts") {
            $(".meos-recent-alert").removeClass("noodknop");
            $(".meos-recent-alert").css({"background-color":"#004682"}); 
        }
    });
}

SetupMeosHome = function() {
    $("#meos-app-name").html("Hosgeldin: " + MI.Phone.Data.PlayerData.charinfo.firstname + " " + MI.Phone.Data.PlayerData.charinfo.lastname);
}

MeosHomePage = function() {
    $(".meos-tabs-footer").animate({
        bottom: -5+"vh"
    }, 200);
    setTimeout(function(){
        $(".meos-homescreen").animate({
            left: 0+"vh"
        }, 200, function(){
            if (CurrentMeosPage == "alerts") {
                $(".meos-alert-new").remove();
            }
            $(".meos-"+CurrentMeosPage+"-page").css({"display":"none"});
            CurrentMeosPage = null;
            $(".person-search-results").html("");
            $(".vehicle-search-results").html("");
        });
        $(".meos-tabs").animate({
            left: -30+"vh"
        }, 200);
    }, 400);
}

$(document).on('click', '.meos-tabs-footer', function(e){
    e.preventDefault();
    MeosHomePage();
});

$(document).on('click', '.person-search-result', function(e){
    e.preventDefault();

    var ClickedPerson = this;
    var ClickedPersonId = $(this).attr('id');
    var ClickedPersonData = $("#"+ClickedPersonId).data('PersonData');

    var Gender = "Man";
    if (ClickedPersonData.gender == "f") {
        Gender = "Female";
    }

    var HasLicense = "True";
    if (!ClickedPersonData.driverlicense) {
        HasLicense = "False";
    }

    var weaponlicense = "False";
    if (ClickedPersonData.weaponlicense) {
        weaponlicense = "True";
    }

    var OpenElement = '<div class="person-search-result-name">Name: '+ClickedPersonData.firstname+' '+ClickedPersonData.lastname+'</div> <div class="person-search-result-bsn">Phone: '+ClickedPersonData.phone+'</div> <div class="person-opensplit"></div> &nbsp; <div class="person-search-result-dob">Birthday: '+ClickedPersonData.birthdate+'</div> <div class="person-search-result-gender">Sex: '+Gender+'</div> &nbsp; <div class="person-search-result-warned">Weapon License: '+weaponlicense+'</div> <div class="person-search-result-driverslicense">Drivers license: '+HasLicense+'</div>';

    if (OpenedPerson === null) {
        $(ClickedPerson).html(OpenElement)
        OpenedPerson = ClickedPerson;
    } else if (OpenedPerson == ClickedPerson) {
        var PreviousPersonId = $(OpenedPerson).attr('id');
        var PreviousPersonData = $("#"+PreviousPersonId).data('PersonData');
        var PreviousElement = '<div class="person-search-result-name">Name: '+PreviousPersonData.firstname+' '+PreviousPersonData.lastname+'</div> <div class="person-search-result-bsn">Phone: '+PreviousPersonData.phone+'</div>';
        $(ClickedPerson).html(PreviousElement)
        OpenedPerson = null;
    } else {
        var PreviousPersonId = $(OpenedPerson).attr('id');
        var PreviousPersonData = $("#"+PreviousPersonId).data('PersonData');
        var PreviousElement = '<div class="person-search-result-name">Name: '+PreviousPersonData.firstname+' '+PreviousPersonData.lastname+'</div> <div class="person-search-result-bsn">Phone: '+PreviousPersonData.phone+'</div>';
        $(OpenedPerson).html(PreviousElement)
        $(ClickedPerson).html(OpenElement)
        OpenedPerson = ClickedPerson;
    }
});

var OpenedHouse = null;

$(document).on('click', '.house-adress-location', function(e){
    e.preventDefault();

    var ClickedHouse = $(this).attr('id');
    var ClickedHouseData = $("#"+ClickedHouse).data('HouseData');

    $.post('http://s4-phone/SetGPSLocation', JSON.stringify({
        coords: ClickedHouseData.coords
    }))
});

$(document).on('click', '.appartment-adress-location', function(e){
    e.preventDefault();

    var ClickedPerson = $(this).attr('id');
    var ClickedPersonData = $("#"+ClickedPerson).data('PersonData');

    $.post('http://s4-phone/SetApartmentLocation', JSON.stringify({
        data: ClickedPersonData
    }));
});

$(document).on('click', '.person-search-result-house', function(e){
    e.preventDefault();

    var ClickedHouse = this;
    var ClickedHouseId = $(this).attr('id');
    var ClickedHouseData = $("#"+ClickedHouseId).data('HouseData');

    var GarageLabel = "Nee";
    if (ClickedHouseData.garage.length > 0 ) {
        GarageLabel = "Ja";
    }

    var OpenElement = '<div class="person-search-result-name">Eigenaar: '+ClickedHouseData.charinfo.firstname+' '+ClickedHouseData.charinfo.lastname+'</div><div class="person-search-result-bsn">Huis: '+ClickedHouseData.label+'</div> <div class="person-opensplit"></div> &nbsp; <div class="person-search-result-dob">Adres: '+ClickedHouseData.label+' &nbsp; <i class="fas fa-map-marker-alt house-adress-location" id="'+ClickedHouseId+'"></i></div> <div class="person-search-result-number">Tier: '+ClickedHouseData.tier+'</div>';

    if (OpenedHouse === null) {
        $(ClickedHouse).html(OpenElement)
        OpenedHouse = ClickedHouse;
    } else if (OpenedHouse == ClickedHouse) {
        var PreviousPersonId = $(OpenedHouse).attr('id');
        var PreviousPersonData = $("#"+PreviousPersonId).data('HouseData');
        var PreviousElement = '<div class="person-search-result-name">Eigenaar: '+PreviousPersonData.charinfo.firstname+' '+PreviousPersonData.charinfo.lastname+'</div> <div class="person-search-result-bsn">House: '+PreviousPersonData.label+'</div>';
        $(ClickedHouse).html(PreviousElement)
        OpenedHouse = null;
    } else {
        var PreviousPersonId = $(OpenedHouse).attr('id');
        var PreviousPersonData = $("#"+PreviousPersonId).data('HouseData');
        var PreviousElement = '<div class="person-search-result-name">Eigenaar: '+PreviousPersonData.charinfo.firstname+' '+PreviousPersonData.charinfo.lastname+'</div> <div class="person-search-result-bsn">House: '+PreviousPersonData.label+'</div>';
        $(OpenedHouse).html(PreviousElement)
        $(ClickedHouse).html(OpenElement)
        OpenedHouse = ClickedHouse;
    }
});

$(document).on('click', '.confirm-search-person-test', function(e){
    e.preventDefault();
    var SearchName = $(".person-search-input").val();

    if (SearchName !== "") {
        $.post('http://s4-phone/FetchSearchResults', JSON.stringify({
            input: SearchName,
        }), function(result){
            if (result != null) {
                $(".person-search-results").html("");
                $.each(result, function (i, person) {
                    var PersonElement = '<div class="person-search-result" id="person-'+i+'"><div class="person-search-result-name">Name: '+person.firstname+' '+person.lastname+'</div> <div class="person-search-result-bsn">Phone: '+person.phone+'</div> </div>';
                    $(".person-search-results").append(PersonElement);
                    $("#person-"+i).data("PersonData", person);
                });
            } else {
                MI.Phone.Notifications.Add("politie", MI.Phone.Functions.Lang("MEOS_TITLE"), MI.Phone.Functions.Lang("MEOS_NORESULT"));
                $(".person-search-results").html("");
            }
        });
    } else {
        MI.Phone.Notifications.Add("politie", MI.Phone.Functions.Lang("MEOS_TITLE"), MI.Phone.Functions.Lang("MEOS_NORESULT"));
        $(".person-search-results").html("");
    }
});

$(document).on('click', '.confirm-search-person-house', function(e){
    e.preventDefault();
    var SearchName = $(".person-search-input-house").val();

    if (SearchName !== "") {
        $.post('http://s4-phone/FetchPlayerHouses', JSON.stringify({
            input: SearchName,
        }), function(result){
            if (result != null) {
                $(".person-search-results").html("");
                $.each(result, function (i, house) {
                    var PersonElement = '<div class="person-search-result-house" id="personhouse-'+i+'"><div class="person-search-result-name">Eigenaar: '+house.charinfo.firstname+' '+house.charinfo.lastname+'</div> <div class="person-search-result-bsn">Huis: '+house.label+'</div></div>';
                    $(".person-search-results").append(PersonElement);
                    $("#personhouse-"+i).data("HouseData", house);
                });
            } else {
                MI.Phone.Notifications.Add("politie", MI.Phone.Functions.Lang("MEOS_TITLE"), MI.Phone.Functions.Lang("MEOS_NORESULT"));
                $(".person-search-results").html("");
            }
        });
    } else {
        MI.Phone.Notifications.Add("politie", MI.Phone.Functions.Lang("MEOS_TITLE"), MI.Phone.Functions.Lang("MEOS_NORESULT"));
        $(".person-search-results").html("");
    }
});

$(document).on('click', '.confirm-search-vehicle', function(e){
    e.preventDefault();
    var SearchName = $(".vehicle-search-input").val();
    
    if (SearchName !== "") {
        $.post('http://s4-phone/FetchVehicleResults', JSON.stringify({
            input: SearchName,
        }), function(result){
            if (result != null) {
                $(".vehicle-search-results").html("");
                $.each(result, function (i, vehicle) {
                    var APK = "Ja";
                    if (!vehicle.status) {
                        APK = "Nee";
                    }
                    var Flagged = "Nee";
                    if (vehicle.isFlagged) {
                        Flagged = "Ja";
                    }
                    
                    var VehicleElement = '<div class="vehicle-search-result"> <div class="vehicle-search-result-name">'+vehicle.label+'</div> <div class="vehicle-search-result-plate">Kenteken: '+vehicle.plate+'</div> <div class="vehicle-opensplit"></div> &nbsp; <div class="vehicle-search-result-owner">Eigenaar: '+vehicle.owner+'</div> &nbsp; <div class="vehicle-search-result-apk">APK: '+APK+'</div> <div class="vehicle-search-result-warrant">Gesignaleerd: '+Flagged+'</div> </div>'
                    $(".vehicle-search-results").append(VehicleElement);
                });
            }
        });
    } else {
        MI.Phone.Notifications.Add("politie", MI.Phone.Functions.Lang("MEOS_TITLE"), MI.Phone.Functions.Lang("MEOS_NORESULT"));
        $(".vehicle-search-results").html("");
    }
});

$(document).on('click', '.scan-search-vehicle', function(e){
    e.preventDefault();
    $.post('http://s4-phone/FetchVehicleScan', JSON.stringify({}), function(vehicle){
        if (vehicle != null) {
            $(".vehicle-search-results").html("");
            var APK = "Ja";
            if (!vehicle.status) {
                APK = "Nee";
            }
            var Flagged = "Nee";
            if (vehicle.isFlagged) {
                Flagged = "Ja";
            }

            var VehicleElement = '<div class="vehicle-search-result"> <div class="vehicle-search-result-name">'+vehicle.label+'</div> <div class="vehicle-search-result-plate">Kenteken: '+vehicle.plate+'</div> <div class="vehicle-opensplit"></div> &nbsp; <div class="vehicle-search-result-owner">Eigenaar: '+vehicle.owner+'</div> &nbsp; <div class="vehicle-search-result-apk">APK: '+APK+'</div> <div class="vehicle-search-result-warrant">Gesignaleerd: '+Flagged+'</div> </div>'
            $(".vehicle-search-results").append(VehicleElement);
        } else {
            MI.Phone.Notifications.Add("politie", MI.Phone.Functions.Lang("MEOS_TITLE"), MI.Phone.Functions.Lang("NO_VEHICLE"));
            $(".vehicle-search-results").append("");
        }
    });
});

AddPoliceAlert = function(data) {
    var randId = Math.floor((Math.random() * 10000) + 1);
    var AlertElement = '';
    if (data.alert.coords != undefined && data.alert.coords != null) {
        AlertElement = '<div class="meos-alert" id="alert-'+randId+'"> <span class="meos-alert-new" style="margin-bottom: 1vh;">NIEUW</span> <p class="meos-alert-type">Melding: '+data.alert.title+'</p> <p class="meos-alert-description">'+data.alert.description+'</p> <hr> <div class="meos-location-button">LOCATIE</div> </div>';
    } else {
        AlertElement = '<div class="meos-alert" id="alert-'+randId+'"> <span class="meos-alert-new" style="margin-bottom: 1vh;">NIEUW</span> <p class="meos-alert-type">Melding: '+data.alert.title+'</p> <p class="meos-alert-description">'+data.alert.description+'</p></div>';
    }
    $(".meos-recent-alerts").html('<div class="meos-recent-alert" id="recent-alert-'+randId+'"><span class="meos-recent-alert-title">Melding: '+data.alert.title+'</span><p class="meos-recent-alert-description">'+data.alert.description+'</p></div>');
    if (data.alert.title == "Assistentie collega") {
        $(".meos-recent-alert").css({"background-color":"#d30404"}); 
        $(".meos-recent-alert").addClass("noodknop");
    }
    $(".meos-alerts").prepend(AlertElement);
    $("#alert-"+randId).data("alertData", data.alert);
    $("#recent-alert-"+randId).data("alertData", data.alert);
}

$(document).on('click', '.meos-recent-alert', function(e){
    e.preventDefault();
    var alertData = $(this).data("alertData");

    if (alertData.coords != undefined && alertData.coords != null) {
        $.post('http://s4-phone/SetAlertWaypoint', JSON.stringify({
            alert: alertData,
        }));
    } else {
        MI.Phone.Notifications.Add("politie", MI.Phone.Functions.Lang("MEOS_TITLE"), MI.Phone.Functions.Lang("MEOS_GPS"));
    }
});

$(document).on('click', '.meos-location-button', function(e){
    e.preventDefault();
    var alertData = $(this).parent().data("alertData");
    $.post('http://s4-phone/SetAlertWaypoint', JSON.stringify({
        alert: alertData,
    }));
});

$(document).on('click', '.meos-clear-alerts', function(e){
    $(".meos-alerts").html("");
    $(".meos-recent-alerts").html('<div class="meos-recent-alert"> <span class="meos-recent-alert-title">You have no notifications yet!</span></div>');
    MI.Phone.Notifications.Add("politie", MI.Phone.Functions.Lang("MEOS_TITLE"), MI.Phone.Functions.Lang("MEOS_CLEARED"));
});

// Notlar

SetupNotlar = function(Notlar) {
	 $(".not_listesi").html(" ");
    $(".garage-vehicles").html("");
    if (Notlar != null) {
        $.each(Notlar, function(i, not){
            var Element = `
			
			
			
<a href="javascript:notGoster('${not.id}');"><div class="nn">
<p id="baslik_">${not.baslik}</p>
<input type="text"  id="b_${not.id}" value="${not.baslik}" style="display:none;" />
<input type="text"  id="t_${not.id}" value="${not.aciklama}" style="display:none;" />
</div></a>
 
			
			
			
			`;
            
            $(".not_listesi").append(Element);
          
        });
    }
}




 
var guncelleme_id = null;

function notGoster(x){

    guncelleme_id = x;

    document.getElementById("gnc_ttr").value = document.getElementById("b_"+x).value;
    document.getElementById("gnc_tarea").value = document.getElementById("t_"+x).value;

    $("#p").css("display", "none");
    $(".n-p").css("display", "none");
	$(".not_listesi").css("display", "none");
    $(".gstr").css("display", "block");
 

}


function not(x){

    if(x == 1){

        $("#p").css("display", "none");
        $(".n-p").css("display", "block");
        $(".gstr").css("display", "none");
		$(".not_listesi").css("display", "none");

    }else{
		
        $("#p").css("display", "block");
        $(".n-p").css("display", "none");
        $(".gstr").css("display", "none");
        $(".not_listesi").css("display", "block");
		$.post('http://s4-phone/GetirNotlar', JSON.stringify({}), function(Notlar){ SetupNotlar(Notlar);  })
    }

    document.getElementById("tarea").value = "Açıklama girin.";
   

}





function kaydetNot(){

var baslik = document.getElementById("ttr").value;
var aciklama = document.getElementById("tarea").value;

MI.Phone.Notifications.Add("fas fa-check-circle", "Notlar", baslik+" Adlı not kaydedildi." )

$.post("http://s4-phone/NotEkle", JSON.stringify({ baslik: baslik, aciklama: aciklama   })); 

not(0);

 

}

 
 
function guncelleNot(){
   
var baslik = document.getElementById("gnc_ttr").value;
var aciklama = document.getElementById("gnc_tarea").value;
 
MI.Phone.Notifications.Add("fas fa-check-circle", "Notlar", baslik+" Adlı not güncellendi." )
 
$.post("http://s4-phone/NotGuncelle", JSON.stringify({ baslik: baslik, aciklama: aciklama, id: guncelleme_id })); 

 
}


function silNot(){
 
 MI.Phone.Notifications.Add("fas fa-check-circle", "Notlar", "Notlar tekrar listelendi." )
 
 $.post("http://s4-phone/NotSil", JSON.stringify({  id: guncelleme_id })); 

 not(0);


}


/// polıce

Setuppolices = function(data) {
    $(".polices-list").html("");
    if (data.length > 0) {
        $.each(data, function(i, police){
            var element = '<div class="police-list" id="policeid-'+i+'"> <div class="police-list-firstletter">' + (police.firstname).charAt(0).toUpperCase() + '</div> <div class="police-list-fullname">' + police.firstname + ' '+ police.lastname + '</div> <div class="police-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".polices-list").append(element);
            $("#policeid-"+i).data('policeData', police);
        });
    } else {
        var element = '<div class="police-list"><div class="no-polices">Şuanda müsait polis yok.</div></div>'
        $(".polices-list").append(element);
    }
}

$(document).on('click', '.police-list-call', function(e){
    e.preventDefault();

    var policeData = $(this).parent().data('policeData');
    
    var cData = {
        number: policeData.phone,
        name: policeData.name
    }

    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (MI.Phone.Data.AnonymousCall) {
                            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_STARTED_ANON"));
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        MI.Phone.Functions.HeaderTextColor("white", 400);
                        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".polices-app").css({"display":"none"});
                            MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            MI.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        MI.Phone.Data.currentApplication = "phone-call";
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                //MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});

/// racing 

var OpenedRaceElement = null;

$(document).ready(function(){
    $('[data-toggle="racetooltip"]').tooltip();
});

$(document).on('click', '.racing-race', function(e){
    e.preventDefault();

    var OpenSize = "15vh";
    var DefaultSize = "9vh";
    var RaceData = $(this).data('RaceData');
    var IsRacer = IsInRace(MI.Phone.Data.PlayerData.citizenid, RaceData.RaceData.Racers)

    if (!RaceData.RaceData.Started || IsRacer) {
        if (OpenedRaceElement === null) {
            $(this).css({"height":OpenSize});
            setTimeout(() => {
                $(this).find('.race-buttons').fadeIn(100);
            }, 100);
            OpenedRaceElement = this;
        } else if (OpenedRaceElement == this) {
            $(this).find('.race-buttons').fadeOut(20);
            $(this).css({"height":DefaultSize});
            OpenedRaceElement = null;
        } else {
            $(OpenedRaceElement).find('.race-buttons').hide();
            $(OpenedRaceElement).css({"height":DefaultSize});
            $(this).css({"height":OpenSize});
            setTimeout(() => {
                $(this).find('.race-buttons').fadeIn(100);
            }, 100);
            OpenedRaceElement = this;
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ALREADY_STARTED"), "#1DA1F2");
    }
});

function GetAmountOfRacers(Racers) {
    var retval = 0
    $.each(Racers, function(i, racer){
        retval = retval + 1
    });
    return retval
}

function IsInRace(citizenid, Racers) {
    var retval = false;
    $.each(Racers, function(cid, racer){
        if (cid == citizenid) {
            retval = true;
        }
    });
    return retval
}

function IsCreator(citizenid, RaceData) {
    var retval = false;
    if (RaceData.SetupSteam == citizenid) {
        retval = true;
    }
    return retval;
}

function SetupRaces(Races) {
    $(".racing-races").html("");
    if (Races.length > 0) {
        Races = (Races).reverse();
        $.each(Races, function(i, race){
            var Locked = '<i class="fas fa-unlock"></i> Henüz başlamadı';
            if (race.RaceData.Started) {
                Locked = '<i class="fas fa-lock"></i> Başlatıldı';
            }
            var LapLabel = "";
            if (race.Laps == 0) {
                LapLabel = "SPRINT"
            } else {
                if (race.Laps == 1) {
                    LapLabel = race.Laps + " Lap";
                } else {
                    LapLabel = race.Laps + " Laps";
                }
            }
            var InRace = IsInRace(MI.Phone.Data.PlayerData.citizenid, race.RaceData.Racers);
            var Creator = IsCreator(MI.Phone.Data.PlayerData.citizenid, race);
            var Buttons = '<div class="race-buttons"> <div class="race-button" id="join-race" data-toggle="racetooltip" data-placement="left" title="Katıl"><i class="fas fa-sign-in-alt"></i></div>';
            if (InRace) {
                if (!Creator) {
                    Buttons = '<div class="race-buttons"> <div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Ayrıl"><i class="fas fa-sign-out-alt"></i></div>';
                } else {
                    if (!race.RaceData.Started) {
                        Buttons = '<div class="race-buttons"> <div class="race-button" id="start-race" data-toggle="racetooltip" data-placement="left" title="Başla"><i class="fas fa-flag-checkered"></i></div><div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Quit"><i class="fas fa-sign-out-alt"></i></div>';
                    } else {
                        Buttons = '<div class="race-buttons"> <div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Ayrıl"><i class="fas fa-sign-out-alt"></i></div>';
                    }
                }
            }
            var Racers = GetAmountOfRacers(race.RaceData.Racers);
            var element = '<div class="racing-race" id="raceid-'+i+'"> <span class="race-name"><i class="fas fa-flag-checkered"></i> '+race.RaceData.RaceName+'</span> <span class="race-track">'+Locked+'</span> <div class="race-infomation"> <div class="race-infomation-tab" id="race-information-laps">'+LapLabel+'</div> <div class="race-infomation-tab" id="race-information-distance">'+race.RaceData.Distance+' m</div> <div class="race-infomation-tab" id="race-information-player"><i class="fas fa-user"></i> '+Racers+'</div> </div> '+Buttons+' </div> </div>';
            $(".racing-races").append(element);
            $("#raceid-"+i).data('RaceData', race);
            if (!race.RaceData.Started) {
                $("#raceid-"+i).css({"border-bottom-color":"#34b121"});
            } else {
                $("#raceid-"+i).css({"border-bottom-color":"#b12121"});
            }
            $('[data-toggle="racetooltip"]').tooltip();
        });
    }
}

$(document).ready(function(){
    $('[data-toggle="race-setup"]').tooltip();
});

$(document).on('click', '#join-race', function(e){
    e.preventDefault();

    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('http://s4-phone/IsInRace', JSON.stringify({}), function(IsInRace){
        if (!IsInRace) {
            $.post('http://s4-phone/RaceDistanceCheck', JSON.stringify({
                RaceId: Data.RaceId,
                Joined: true,
            }), function(InDistance){
                if (InDistance) {
                    $.post('http://s4-phone/IsBusyCheck', JSON.stringify({
                        check: "editor"
                    }), function(IsBusy){
                        if (!IsBusy) {
                            $.post('http://s4-phone/JoinRace', JSON.stringify({
                                RaceData: Data,
                            }));
                            $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
                                SetupRaces(Races);
                            });
                        } else {
                            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_INEDITOR"), "#1DA1F2");
                        }
                    });
                }
            })
        } else {
            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ALREADY_INRACE"), "#1DA1F2");
        }
    });
});

$(document).on('click', '#quit-race', function(e){
    e.preventDefault();

    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('http://s4-phone/LeaveRace', JSON.stringify({
        RaceData: Data,
    }));

    $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
        SetupRaces(Races);
    });
});

$(document).on('click', '#start-race', function(e){
    e.preventDefault();

    
    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('http://s4-phone/StartRace', JSON.stringify({
        RaceData: Data,
    }));

    $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
        SetupRaces(Races);
    });
});

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}


/*Dropdown Menu*/
$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$(document).on('click', '.dropdown .dropdown-menu li', function(e) {
    $.post('http://s4-phone/GetTrackData', JSON.stringify({
        RaceId: $(this).attr('id')
    }), function(TrackData){
        if ((TrackData.CreatorData.charinfo.lastname).length > 8) {
            TrackData.CreatorData.charinfo.lastname = TrackData.CreatorData.charinfo.lastname.substring(0, 8);
        }
        var CreatorTag = TrackData.CreatorData.charinfo.firstname.charAt(0).toUpperCase() + ". " + TrackData.CreatorData.charinfo.lastname;

        $(".racing-setup-information-distance").html('Mesafe: '+TrackData.Distance+' m');
        $(".racing-setup-information-creator").html('Yarış Sahibi: ' + CreatorTag);
        if (TrackData.Records.Holder !== undefined) {
            if (TrackData.Records.Holder[1].length > 8) {
                TrackData.Records.Holder[1] = TrackData.Records.Holder[1].substring(0, 8) + "..";
            }
            var Holder = TrackData.Records.Holder[0].charAt(0).toUpperCase() + ". " + TrackData.Records.Holder[1];
            $(".racing-setup-information-wr").html('WR: ' + secondsTimeSpanToHMS(TrackData.Records.Time) + ' ('+Holder+')');
        } else {
            $(".racing-setup-information-wr").html('WR: N/A');
        }
    });

    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/

$(document).on('click', '#setup-race', function(e){
    e.preventDefault();

    $(".racing-overview").animate({
        left: 30+"vh"
    }, 300);
    $(".racing-setup").animate({
        left: 0
    }, 300);

    $.post('http://s4-phone/GetRaces', JSON.stringify({}), function(Races){
        if (Races !== undefined && Races !== null) {
            $(".dropdown-menu").html("");
            $.each(Races, function(i, race){
                if (!race.Started && !race.Waiting) {
                    var elem = '<li id="'+race.RaceId+'">'+race.RaceName+'</li>';
                    $(".dropdown-menu").append(elem);
                }
            });
        }
    });
});

$(document).on('click', '#create-race', function(e){
    e.preventDefault();
    $.post('http://s4-phone/IsAuthorizedToCreateRaces', JSON.stringify({}), function(data){
        if (data.IsAuthorized) {
            if (!data.IsBusy) {
                $.post('http://s4-phone/IsBusyCheck', JSON.stringify({
                    check: "race"
                }), function(InRace){
                    if (!InRace) {
                        $(".racing-create").fadeIn(200);
                    } else {
                        MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_INRACE"), "#1DA1F2");
                    }
                });
            } else {
                MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ALREADY_CREATED"), "#1DA1F2");
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CANTSTART"), "#1DA1F2");
        }
    });
});

$(document).on('click', '#racing-create-accept', function(e){
    e.preventDefault();
    var TrackName = $(".racing-create-trackname").val();

    if (TrackName !== "" && TrackName !== undefined && TrackName !== null) {
        $.post('http://s4-phone/IsAuthorizedToCreateRaces', JSON.stringify({
            TrackName: TrackName
        }), function(data){
            if (data.IsAuthorized) {
                if (data.IsNameAvailable) {
                    $.post('http://s4-phone/StartTrackEditor', JSON.stringify({
                        TrackName: TrackName
                    }));
                    $(".racing-create").fadeOut(200, function(){
                        $(".racing-create-trackname").val("");
                    });
                } else {
                    MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CANTTHISNAME"), "#1DA1F2");
                }
            } else {
                MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CANTSTART"), "#1DA1F2");
            }
        });
    } else {
        MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ENTER_TRACK"), "#1DA1F2");
    }
});

$(document).on('click', '#racing-create-cancel', function(e){
    e.preventDefault();
    $(".racing-create").fadeOut(200, function(){
        $(".racing-create-trackname").val("");
    });
});

$(document).on('click', '#setup-race-accept', function(e){
    e.preventDefault();

    var track = $('.dropdown').find('input').attr('value');
    var laps = $(".racing-setup-laps").val();

    $.post('http://s4-phone/HasCreatedRace', JSON.stringify({}), function(HasCreatedRace){
        if (!HasCreatedRace) {
            $.post('http://s4-phone/RaceDistanceCheck', JSON.stringify({
                RaceId: track,
                Joined: false,
            }), function(InDistance){
                if (InDistance) {
                    if (track !== undefined || track !== null) {
                        if (laps !== "") {
                            $.post('http://s4-phone/CanRaceSetup', JSON.stringify({}), function(CanSetup){
                                if (CanSetup) {
                                    $.post('http://s4-phone/SetupRace', JSON.stringify({
                                        RaceId: track,
                                        AmountOfLaps: laps,
                                    }))
                                    $(".racing-overview").animate({
                                        left: 0+"vh"
                                    }, 300)
                                    $(".racing-setup").animate({
                                        left: -30+"vh"
                                    }, 300, function(){
                                        $(".racing-setup-information-distance").html('Bölüm seç');
                                        $(".racing-setup-information-creator").html('Bölüm seç');
                                        $(".racing-setup-information-wr").html('Bölüm seç');
                                        $(".racing-setup-laps").val("");
                                        $('.dropdown').find('input').removeAttr('value');
                                        $('.dropdown').find('span').text("Bölüm seç");
                                    });
                                } else {
                                    MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CANT_THIS_TIME"), "#1DA1F2");
                                }
                            });
                        } else {
                            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ENTER_ROUNDS"), "#1DA1F2");
                        }
                    } else {
                        MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CHOSEN_TRACK"), "#1DA1F2");
                    }
                }
            })
        } else {
            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ALREADY_ACTIVE"), "#1DA1F2");
        }
    });
});

$(document).on('click', '#setup-race-cancel', function(e){
    e.preventDefault();

    $(".racing-overview").animate({
        left: 0+"vh"
    }, 300);
    $(".racing-setup").animate({
        left: -30+"vh"
    }, 300, function(){
        $(".racing-setup-information-distance").html('Bölüm seç');
        $(".racing-setup-information-creator").html('Bölüm seç');
        $(".racing-setup-information-wr").html('Bölüm seç');
        $(".racing-setup-laps").val("");
        $('.dropdown').find('input').removeAttr('value');
        $('.dropdown').find('span').text("Bölüm seç");
    });
});

$(document).on('click', '.racing-leaderboard-item', function(e){
    e.preventDefault();

    var Data = $(this).data('LeaderboardData');

    $(".racing-leaderboard-details-block-trackname").html('<i class="fas fa-flag-checkered"></i> '+Data.RaceName);
    $(".racing-leaderboard-details-block-list").html("");
    $.each(Data.LastLeaderboard, function(i, leaderboard){

        var lastname = leaderboard.Holder[1]
        var bestroundtime = "N/A";
        var place = i + 1;
        if (lastname.length > 10) {
            lastname = lastname.substring(0, 10) + "..."
        }
        if (leaderboard.BestLap !== "DNF") {
            bestroundtime = secondsTimeSpanToHMS(leaderboard.BestLap);
        } else {
            place = "DNF"
        }
        var elem = '<div class="row"> <div class="name">' + ((leaderboard.Holder[0]).charAt(0)).toUpperCase() + '. ' + lastname + '</div><div class="time">'+bestroundtime+'</div><div class="score">'+ place +'</div> </div>';
        $(".racing-leaderboard-details-block-list").append(elem);
    });
    $(".racing-leaderboard-details").fadeIn(200);
});

$(document).on('click', '.racing-leaderboard-details-back', function(e){
    e.preventDefault();

    $(".racing-leaderboard-details").fadeOut(200);
});

$(document).on('click', '.racing-leaderboards-button', function(e){
    e.preventDefault();

    $(".racing-leaderboard").animate({
        left: -30+"vh"
    }, 300)
    $(".racing-overview").animate({
        left: 0+"vh"
    }, 300)
});

$(document).on('click', '#leaderboards-race', function(e){
    e.preventDefault();

    $.post('http://s4-phone/GetRacingLeaderboards', JSON.stringify({}), function(Races){
        if (Races !== null) {
            $(".racing-leaderboards").html("");
            $.each(Races, function(i, race){
                if (race.LastLeaderboard.length > 0) {
                    var elem = '<div class="racing-leaderboard-item" id="leaderboard-item-'+i+'"> <span class="racing-leaderboard-item-name"><i class="fas fa-flag-checkered"></i> '+race.RaceName+'</span> <span class="racing-leaderboard-item-info">Detay için tıklayın!</span> </div>'
                    $(".racing-leaderboards").append(elem);
                    $("#leaderboard-item-"+i).data('LeaderboardData', race);
                }
            });
        }
    });

    $(".racing-overview").animate({
        left: 30+"vh"
    }, 300)
    $(".racing-leaderboard").animate({
        left: 0+"vh"
    }, 300)
});

// racing

var OpenedRaceElement = null;

$(document).ready(function(){
    $('[data-toggle="racetooltip"]').tooltip();
});

$(document).on('click', '.racing-race', function(e){
    e.preventDefault();

    var OpenSize = "15vh";
    var DefaultSize = "9vh";
    var RaceData = $(this).data('RaceData');
    var IsRacer = IsInRace(MI.Phone.Data.PlayerData.citizenid, RaceData.RaceData.Racers)

    if (!RaceData.RaceData.Started || IsRacer) {
        if (OpenedRaceElement === null) {
            $(this).css({"height":OpenSize});
            setTimeout(() => {
                $(this).find('.race-buttons').fadeIn(100);
            }, 100);
            OpenedRaceElement = this;
        } else if (OpenedRaceElement == this) {
            $(this).find('.race-buttons').fadeOut(20);
            $(this).css({"height":DefaultSize});
            OpenedRaceElement = null;
        } else {
            $(OpenedRaceElement).find('.race-buttons').hide();
            $(OpenedRaceElement).css({"height":DefaultSize});
            $(this).css({"height":OpenSize});
            setTimeout(() => {
                $(this).find('.race-buttons').fadeIn(100);
            }, 100);
            OpenedRaceElement = this;
        }
    } else {
        MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ALREADY_STARTED"), "#1DA1F2");
    }
});

function GetAmountOfRacers(Racers) {
    var retval = 0
    $.each(Racers, function(i, racer){
        retval = retval + 1
    });
    return retval
}

function IsInRace(citizenid, Racers) {
    var retval = false;
    $.each(Racers, function(cid, racer){
        if (cid == citizenid) {
            retval = true;
        }
    });
    return retval
}

function IsCreator(citizenid, RaceData) {
    var retval = false;
    if (RaceData.SetupSteam == citizenid) {
        retval = true;
    }
    return retval;
}

function SetupRaces(Races) {
    $(".racing-races").html("");
    if (Races.length > 0) {
        Races = (Races).reverse();
        $.each(Races, function(i, race){
            var Locked = '<i class="fas fa-unlock"></i> Henüz başlamadı';
            if (race.RaceData.Started) {
                Locked = '<i class="fas fa-lock"></i> Başlatıldı';
            }
            var LapLabel = "";
            if (race.Laps == 0) {
                LapLabel = "SPRINT"
            } else {
                if (race.Laps == 1) {
                    LapLabel = race.Laps + " Lap";
                } else {
                    LapLabel = race.Laps + " Laps";
                }
            }
            var InRace = IsInRace(MI.Phone.Data.PlayerData.citizenid, race.RaceData.Racers);
            var Creator = IsCreator(MI.Phone.Data.PlayerData.citizenid, race);
            var Buttons = '<div class="race-buttons"> <div class="race-button" id="join-race" data-toggle="racetooltip" data-placement="left" title="Katıl"><i class="fas fa-sign-in-alt"></i></div>';
            if (InRace) {
                if (!Creator) {
                    Buttons = '<div class="race-buttons"> <div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Ayrıl"><i class="fas fa-sign-out-alt"></i></div>';
                } else {
                    if (!race.RaceData.Started) {
                        Buttons = '<div class="race-buttons"> <div class="race-button" id="start-race" data-toggle="racetooltip" data-placement="left" title="Başla"><i class="fas fa-flag-checkered"></i></div><div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Quit"><i class="fas fa-sign-out-alt"></i></div>';
                    } else {
                        Buttons = '<div class="race-buttons"> <div class="race-button" id="quit-race" data-toggle="racetooltip" data-placement="right" title="Ayrıl"><i class="fas fa-sign-out-alt"></i></div>';
                    }
                }
            }
            var Racers = GetAmountOfRacers(race.RaceData.Racers);
            var element = '<div class="racing-race" id="raceid-'+i+'"> <span class="race-name"><i class="fas fa-flag-checkered"></i> '+race.RaceData.RaceName+'</span> <span class="race-track">'+Locked+'</span> <div class="race-infomation"> <div class="race-infomation-tab" id="race-information-laps">'+LapLabel+'</div> <div class="race-infomation-tab" id="race-information-distance">'+race.RaceData.Distance+' m</div> <div class="race-infomation-tab" id="race-information-player"><i class="fas fa-user"></i> '+Racers+'</div> </div> '+Buttons+' </div> </div>';
            $(".racing-races").append(element);
            $("#raceid-"+i).data('RaceData', race);
            if (!race.RaceData.Started) {
                $("#raceid-"+i).css({"border-bottom-color":"#34b121"});
            } else {
                $("#raceid-"+i).css({"border-bottom-color":"#b12121"});
            }
            $('[data-toggle="racetooltip"]').tooltip();
        });
    }
}

$(document).ready(function(){
    $('[data-toggle="race-setup"]').tooltip();
});

$(document).on('click', '#join-race', function(e){
    e.preventDefault();

    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('http://s4-phone/IsInRace', JSON.stringify({}), function(IsInRace){
        if (!IsInRace) {
            $.post('http://s4-phone/RaceDistanceCheck', JSON.stringify({
                RaceId: Data.RaceId,
                Joined: true,
            }), function(InDistance){
                if (InDistance) {
                    $.post('http://s4-phone/IsBusyCheck', JSON.stringify({
                        check: "editor"
                    }), function(IsBusy){
                        if (!IsBusy) {
                            $.post('http://s4-phone/JoinRace', JSON.stringify({
                                RaceData: Data,
                            }));
                            $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
                                SetupRaces(Races);
                            });
                        } else {
                            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_INEDITOR"), "#1DA1F2");
                        }
                    });
                }
            })
        } else {
            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ALREADY_INRACE"), "#1DA1F2");
        }
    });
});

$(document).on('click', '#quit-race', function(e){
    e.preventDefault();

    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('http://s4-phone/LeaveRace', JSON.stringify({
        RaceData: Data,
    }));

    $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
        SetupRaces(Races);
    });
});

$(document).on('click', '#start-race', function(e){
    e.preventDefault();

    
    var RaceId = $(this).parent().parent().attr('id');
    var Data = $("#"+RaceId).data('RaceData');

    $.post('http://s4-phone/StartRace', JSON.stringify({
        RaceData: Data,
    }));

    $.post('http://s4-phone/GetAvailableRaces', JSON.stringify({}), function(Races){
        SetupRaces(Races);
    });
});

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}


/*Dropdown Menu*/
$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$(document).on('click', '.dropdown .dropdown-menu li', function(e) {
    $.post('http://s4-phone/GetTrackData', JSON.stringify({
        RaceId: $(this).attr('id')
    }), function(TrackData){
        if ((TrackData.CreatorData.charinfo.lastname).length > 8) {
            TrackData.CreatorData.charinfo.lastname = TrackData.CreatorData.charinfo.lastname.substring(0, 8);
        }
        var CreatorTag = TrackData.CreatorData.charinfo.firstname.charAt(0).toUpperCase() + ". " + TrackData.CreatorData.charinfo.lastname;

        $(".racing-setup-information-distance").html('Mesafe: '+TrackData.Distance+' m');
        $(".racing-setup-information-creator").html('Yarış Sahibi: ' + CreatorTag);
        if (TrackData.Records.Holder !== undefined) {
            if (TrackData.Records.Holder[1].length > 8) {
                TrackData.Records.Holder[1] = TrackData.Records.Holder[1].substring(0, 8) + "..";
            }
            var Holder = TrackData.Records.Holder[0].charAt(0).toUpperCase() + ". " + TrackData.Records.Holder[1];
            $(".racing-setup-information-wr").html('WR: ' + secondsTimeSpanToHMS(TrackData.Records.Time) + ' ('+Holder+')');
        } else {
            $(".racing-setup-information-wr").html('WR: N/A');
        }
    });

    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});
/*End Dropdown Menu*/

$(document).on('click', '#setup-race', function(e){
    e.preventDefault();

    $(".racing-overview").animate({
        left: 30+"vh"
    }, 300);
    $(".racing-setup").animate({
        left: 0
    }, 300);

    $.post('http://s4-phone/GetRaces', JSON.stringify({}), function(Races){
        if (Races !== undefined && Races !== null) {
            $(".dropdown-menu").html("");
            $.each(Races, function(i, race){
                if (!race.Started && !race.Waiting) {
                    var elem = '<li id="'+race.RaceId+'">'+race.RaceName+'</li>';
                    $(".dropdown-menu").append(elem);
                }
            });
        }
    });
});

$(document).on('click', '#create-race', function(e){
    e.preventDefault();
    $.post('http://s4-phone/IsAuthorizedToCreateRaces', JSON.stringify({}), function(data){
        if (data.IsAuthorized) {
            if (!data.IsBusy) {
                $.post('http://s4-phone/IsBusyCheck', JSON.stringify({
                    check: "race"
                }), function(InRace){
                    if (!InRace) {
                        $(".racing-create").fadeIn(200);
                    } else {
                        MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_INRACE"), "#1DA1F2");
                    }
                });
            } else {
                MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ALREADY_CREATED"), "#1DA1F2");
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CANTSTART"), "#1DA1F2");
        }
    });
});

$(document).on('click', '#racing-create-accept', function(e){
    e.preventDefault();
    var TrackName = $(".racing-create-trackname").val();

    if (TrackName !== "" && TrackName !== undefined && TrackName !== null) {
        $.post('http://s4-phone/IsAuthorizedToCreateRaces', JSON.stringify({
            TrackName: TrackName
        }), function(data){
            if (data.IsAuthorized) {
                if (data.IsNameAvailable) {
                    $.post('http://s4-phone/StartTrackEditor', JSON.stringify({
                        TrackName: TrackName
                    }));
                    $(".racing-create").fadeOut(200, function(){
                        $(".racing-create-trackname").val("");
                    });
                } else {
                    MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CANTTHISNAME"), "#1DA1F2");
                }
            } else {
                MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CANTSTART"), "#1DA1F2");
            }
        });
    } else {
        MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ENTER_TRACK"), "#1DA1F2");
    }
});

$(document).on('click', '#racing-create-cancel', function(e){
    e.preventDefault();
    $(".racing-create").fadeOut(200, function(){
        $(".racing-create-trackname").val("");
    });
});

$(document).on('click', '#setup-race-accept', function(e){
    e.preventDefault();

    var track = $('.dropdown').find('input').attr('value');
    var laps = $(".racing-setup-laps").val();

    $.post('http://s4-phone/HasCreatedRace', JSON.stringify({}), function(HasCreatedRace){
        if (!HasCreatedRace) {
            $.post('http://s4-phone/RaceDistanceCheck', JSON.stringify({
                RaceId: track,
                Joined: false,
            }), function(InDistance){
                if (InDistance) {
                    if (track !== undefined || track !== null) {
                        if (laps !== "") {
                            $.post('http://s4-phone/CanRaceSetup', JSON.stringify({}), function(CanSetup){
                                if (CanSetup) {
                                    $.post('http://s4-phone/SetupRace', JSON.stringify({
                                        RaceId: track,
                                        AmountOfLaps: laps,
                                    }))
                                    $(".racing-overview").animate({
                                        left: 0+"vh"
                                    }, 300)
                                    $(".racing-setup").animate({
                                        left: -30+"vh"
                                    }, 300, function(){
                                        $(".racing-setup-information-distance").html('Bölüm seç');
                                        $(".racing-setup-information-creator").html('Bölüm seç');
                                        $(".racing-setup-information-wr").html('Bölüm seç');
                                        $(".racing-setup-laps").val("");
                                        $('.dropdown').find('input').removeAttr('value');
                                        $('.dropdown').find('span').text("Bölüm seç");
                                    });
                                } else {
                                    MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CANT_THIS_TIME"), "#1DA1F2");
                                }
                            });
                        } else {
                            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ENTER_ROUNDS"), "#1DA1F2");
                        }
                    } else {
                        MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_CHOSEN_TRACK"), "#1DA1F2");
                    }
                }
            })
        } else {
            MI.Phone.Notifications.Add("fas fa-flag-checkered", MI.Phone.Functions.Lang("RACING_TITLE"), MI.Phone.Functions.Lang("RACING_ALREADY_ACTIVE"), "#1DA1F2");
        }
    });
});

$(document).on('click', '#setup-race-cancel', function(e){
    e.preventDefault();

    $(".racing-overview").animate({
        left: 0+"vh"
    }, 300);
    $(".racing-setup").animate({
        left: -30+"vh"
    }, 300, function(){
        $(".racing-setup-information-distance").html('Bölüm seç');
        $(".racing-setup-information-creator").html('Bölüm seç');
        $(".racing-setup-information-wr").html('Bölüm seç');
        $(".racing-setup-laps").val("");
        $('.dropdown').find('input').removeAttr('value');
        $('.dropdown').find('span').text("Bölüm seç");
    });
});

$(document).on('click', '.racing-leaderboard-item', function(e){
    e.preventDefault();

    var Data = $(this).data('LeaderboardData');

    $(".racing-leaderboard-details-block-trackname").html('<i class="fas fa-flag-checkered"></i> '+Data.RaceName);
    $(".racing-leaderboard-details-block-list").html("");
    $.each(Data.LastLeaderboard, function(i, leaderboard){

        var lastname = leaderboard.Holder[1]
        var bestroundtime = "N/A";
        var place = i + 1;
        if (lastname.length > 10) {
            lastname = lastname.substring(0, 10) + "..."
        }
        if (leaderboard.BestLap !== "DNF") {
            bestroundtime = secondsTimeSpanToHMS(leaderboard.BestLap);
        } else {
            place = "DNF"
        }
        var elem = '<div class="row"> <div class="name">' + ((leaderboard.Holder[0]).charAt(0)).toUpperCase() + '. ' + lastname + '</div><div class="time">'+bestroundtime+'</div><div class="score">'+ place +'</div> </div>';
        $(".racing-leaderboard-details-block-list").append(elem);
    });
    $(".racing-leaderboard-details").fadeIn(200);
});

$(document).on('click', '.racing-leaderboard-details-back', function(e){
    e.preventDefault();

    $(".racing-leaderboard-details").fadeOut(200);
});

$(document).on('click', '.racing-leaderboards-button', function(e){
    e.preventDefault();

    $(".racing-leaderboard").animate({
        left: -30+"vh"
    }, 300)
    $(".racing-overview").animate({
        left: 0+"vh"
    }, 300)
});

$(document).on('click', '#leaderboards-race', function(e){
    e.preventDefault();

    $.post('http://s4-phone/GetRacingLeaderboards', JSON.stringify({}), function(Races){
        if (Races !== null) {
            $(".racing-leaderboards").html("");
            $.each(Races, function(i, race){
                if (race.LastLeaderboard.length > 0) {
                    var elem = '<div class="racing-leaderboard-item" id="leaderboard-item-'+i+'"> <span class="racing-leaderboard-item-name"><i class="fas fa-flag-checkered"></i> '+race.RaceName+'</span> <span class="racing-leaderboard-item-info">Detay için tıklayın!</span> </div>'
                    $(".racing-leaderboards").append(elem);
                    $("#leaderboard-item-"+i).data('LeaderboardData', race);
                }
            });
        }
    });

    $(".racing-overview").animate({
        left: 30+"vh"
    }, 300)
    $(".racing-leaderboard").animate({
        left: 0+"vh"
    }, 300)
});

/// taxi 


SetupDrivers = function(data) {
    $(".driver-list").html("");
    // console.log(JSON.stringify(data))
    if (data.length > 0) {
        $.each(data, function(i, taxi){
            var element = '<div class="taxi-list" id="taxiid-'+i+'"> <div class="taxi-list-firstletter">' + (taxi.name).charAt(0).toUpperCase() + '</div> <div class="taxi-list-fullname">' + taxi.name + '</div> <div class="taxi-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".driver-list").append(element);
            $("#taxiid-"+i).data('taxiData', taxi);
        });
    } else {
        var element = '<div class="taxi-list"><div class="no-driver">There are no Taxi available..</div></div>'
        $(".driver-list").append(element);
    }
}

$(document).on('click', '.taxi-list-call', function(e){
    e.preventDefault();

    var taxiData = $(this).parent().data('taxiData');
    
    var cData = {
        number: taxiData.phone,
        name: taxiData.name
    }

    $.post('http://s4-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: MI.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== MI.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (MI.Phone.Data.AnonymousCall) {
                            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_STARTED_ANON"));
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        MI.Phone.Functions.HeaderTextColor("white", 400);
                        MI.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".lawyers-app").css({"display":"none"});
                            MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            MI.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        MI.Phone.Data.currentApplication = "phone-call";
                    } else {
                        MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_BUSY"));
                    }
                } else {
                    MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_TALKING"));
                }
            } else {
                //MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_PERSON_UNAVAILABLE"));
				cagriManager(0);
            }
        } else {
            MI.Phone.Notifications.Add("fas fa-phone", MI.Phone.Functions.Lang("PHONE_TITLE"), MI.Phone.Functions.Lang("PHONE_YOUR_NUMBER"));
        }
    });
});
 


(function() {
  function dir() {
    a = x - x1, b = y - y1;
    if (!(parseInt(Math.sqrt(a * a + b * b), 10) < THRESHOLD)) {
      if (x1 - x > Math.abs(y - y1)) {
        return "left";
      }
      if (x - x1 > Math.abs(y - y1)) {
        return "right";
      }
      if (y1 - y > Math.abs(x - x1)) {
        return "up";
      }
      if (y - y1 > Math.abs(x - x1)) {
        return "down";
      }
    } else {
      return "none";
    }
  }
  THRESHOLD = 15;
  x = y = x1 = y1 = 0;
  recordedTime = (new Date).getTime();
  document.documentElement.addEventListener("touchstart", function(a) {
    50 < (new Date).getTime() - recordedTime && (x = parseInt(a.changedTouches[0].pageX, 10), y = parseInt(a.changedTouches[0].pageY, 10), recordedTime = (new Date).getTime());
  }, !1);
  document.documentElement.addEventListener("touchend", function(a) {
    x1 = x;
    y1 = y;
    x = parseInt(a.changedTouches[0].pageX, 10);
    y = parseInt(a.changedTouches[0].pageY, 10);
    //document.getElementById("direction").innerHTML = dir();
	ust_menu_ac(dir());
    recordedTime = (new Date).getTime();
  }, !1);
  document.documentElement.addEventListener("mousedown", function(a) {
    50 < (new Date).getTime() - recordedTime && (x = a.clientX, y = a.clientY, recordedTime = (new Date).getTime());
  }, !1);
  document.documentElement.addEventListener("mouseup", function(a) {
    x1 = x;
    y1 = y;
    x = a.clientX;
    y = a.clientY;
    //document.getElementById("direction").innerHTML = dir();
	ust_menu_ac(dir());
    recordedTime = (new Date).getTime();
  }, !1);
  document.documentElement.style.userSelect = "none";
})();



function ust_menu_ac(x){
	
	if(x == "down") {
		$(".ustbar").css({"display":"block"}); 
		
		setTimeout(function(){ $(".ustbar").css({"height":"55vh"   }); }, 100);
		
	}
	
	if(x == "right") {
		if(donmus == true){
		$(".ustbar").css({"display":"block"}); 
		
		setTimeout(function(){ $(".ustbar").css({"height":"55vh"  }); }, 100);
		}
	}
	
	if(x == "left") {
		if(donmus == true){	
				$(".ustbar").css({"height":"0vh","backdrop-filter":"" });
		setTimeout(function(){ $(".ustbar").css({"display":"none"});  }, 1000);
			}
	}
	
	if(x == "up") {
		
		$(".ustbar").css({"height":"0vh","backdrop-filter":"" });
		setTimeout(function(){ $(".ustbar").css({"display":"none"});  }, 1000);

	}
}



$(function() {
    $( ".hesapmakinesi-app " ).click(function() {
        $( ".text" ).focus();
    });

    $(".text").keydown(function (e) {
    //  backspace, delete, tab, escape, enter and vb tuşlara izin vermek için.
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 109, 110, 190]) !== -1 ||
            (e.keyCode == 65 && e.ctrlKey === true) || // ctrl-a
            (e.keyCode == 67 && e.ctrlKey === true) || //ctrl + c
            (e.keyCode == 88 && e.ctrlKey === true) || //crtl + x 
            (e.keyCode == 55 && e.shiftKey === true) || // :/
            (e.keyCode == 109 ) || // -
            (e.keyCode == 107 ) || // +
            (e.keyCode == 106 ) || // *
            (e.keyCode >= 35 && e.keyCode <= 39)) { // sol , sag
            
            return;
        }
        // sayisal deger sorgulama
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
});


function sayiekle(sayi) {
    document.form.text.value = document.form.text.value + sayi;
}

function sonuc() {
    var deger = document.form.text.value;
    if (deger){
        document.form.text.value=eval(deger);
    }
}

function hepsiniSil() {
    document.form.text.value="";
}
        
function sil2() {
    var deger = document.form.text.value;
    document.form.text.value = deger.substring(0,deger.length-1);
}

function formEngelle(event) {
    event = event || window.event;
    if (event.which === 13) {
        event.preventDefault();
        return (false);
    }
}

//enter ile sonuc bulma
document.onkeyup = function (data) {
    if ( data.which == 13 ) {
        sonuc();
    }
};


function paylasBT(){
	$.post('http://s4-phone/s4shareGET', JSON.stringify({}), function(Hesaplar){
        ListeleBT(Hesaplar);
		$(".BTT").css("display","block");	 
     });
}


function paylasBTKP(){
	$(".BTT").css("display","none");
}

// -------------------------
//   0 - ULAŞILAMIYOR - PHONE_PERSON_UNAVAILABLE
var lastcagri = 1;

function cagriManager(x) {
	
	if(x == 0) {

    $(".phone-call-incoming").css({"display":"none"});
    $(".phone-call-outgoing").css({"display":"none"});
    $(".phone-call-ongoing").css({"display":"none"});
	$(".phone-call-bilgi").css({"display":"block"});
	
	
	$(".phone-call-bilgi-caller").html("Ulaşılamıyor");
    
	setTimeout(function(){
                                $(".phone-app").css({"display":"none"});
                                MI.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                                MI.Phone.Functions.ToggleApp("phone-call", "block");
                            }, 450);
							
							
    MI.Phone.Functions.HeaderTextColor("white", 500);
    MI.Phone.Animations.TopSlideDown('.phone-application-container', 500, 0);
    MI.Phone.Animations.TopSlideDown('.phone-call-app', 500, 0);
    MI.Phone.Functions.ToggleApp("phone-call", "block");
                
    MI.Phone.Data.currentApplication = "phone-call";
	
	var audio = document.getElementById("audio");
	$("#audio").attr("src","../html/ses/0_"+lastcagri+".ogg");

	
     audio.play();

      if(lastcagri == 1){
		lastcagri = 2;
	  }else {
		lastcagri = 1;
	  }
   
		
	}
	
}




 