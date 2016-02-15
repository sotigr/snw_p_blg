using System;
using System.Web;
using System.Web.SessionState;
using System.Web.Http;
using System.Collections.Generic;
namespace snw
{
    public class Global : HttpApplication
    {

        void Application_Start(object sender, EventArgs e)
        {
            LoadSettings();
            GlobalConfiguration.Configure(WebConfig.Register);
           core.database.MySQL = new System.Net.MySql.MySqlHelper(core.system.settings.DATABASE.DOMAIN, core.system.settings.DATABASE.PORT, core.system.settings.DATABASE.DATABASE_NAME, core.system.settings.DATABASE.USERNAME, core.system.settings.DATABASE.PASSWORD);
            core.utility.locale = new Dictionary<string, Dictionary<string, string>>();
            core.scheduler.Current = new core.scheduler();
            core.scheduler.Current.Start(10);
            LoadLocale();
            core.utility.BackupSchedulerCurrent = new core.system.backups.BackupScheduler();
            core.utility.BackupSchedulerCurrent.AddBackupPath("C:\\storage\\");
            core.utility.architect = new core.system.architect(true);
        }
        void LoadSettings()
        {
            IniFile pathtosettingsini = new IniFile(HttpContext.Current.Server.MapPath("/") + "settings.ini");

            IniFile ini = new IniFile(pathtosettingsini.ReadValue("SETTINGS","PATH"));
            core.system.settings.GENERAL.DOMAIN = ini.ReadValue("GENERAL", "DOMAIN");

            core.system.settings.ARCHITECT.MASTER_PAGE_PATH = IniPathFix(ini.ReadValue("ARCHITECT", "MASTER_PAGE_PATH"));
            core.system.settings.ARCHITECT.CONTENT_PAGE_PATH = IniPathFix(ini.ReadValue("ARCHITECT", "CONTENT_PAGE_PATH"));
            core.system.settings.ARCHITECT.CSS_PATH = IniPathFix(ini.ReadValue("ARCHITECT", "CSS_PATH"));
            core.system.settings.ARCHITECT.JS_PATH = IniPathFix(ini.ReadValue("ARCHITECT", "JS_PATH"));
            core.system.settings.ARCHITECT.STATUS_PAGE_PATH = IniPathFix(ini.ReadValue("ARCHITECT", "STATUS_PAGE_PATH"));

            core.system.settings.DATABASE.DOMAIN = ini.ReadValue("DATABASE", "DOMAIN");
            core.system.settings.DATABASE.PORT = ini.ReadValue("DATABASE", "PORT");
            core.system.settings.DATABASE.USERNAME = ini.ReadValue("DATABASE", "USERNAME");
            core.system.settings.DATABASE.PASSWORD = ini.ReadValue("DATABASE", "PASSWORD");
            core.system.settings.DATABASE.DATABASE_NAME = ini.ReadValue("DATABASE", "DATABASE_NAME");

     
        }
        private string  IniPathFix(string path)
        {
            if (path.StartsWith("~"))
            {
                return HttpContext.Current.Server.MapPath("/") + path.Remove(0, 1);
            }
            return path;
        }
        void LoadLocale()
        {
            core.utility.locale["el-GR"] = getlocale("el-GR");
            core.utility.locale["en-US"] = getlocale("en-US");
        }
        Dictionary<string, string> getlocale(string lang)
        {
            IDictionary<int, IDictionary<string, string>> raw_dict = new Dictionary<int,IDictionary<string,string>>();
           /* if (lang == "el-GR")
            {
                raw_dict = core.database.MySQL.SendQuery("select * from locale_en");
            }
            else
            {*/
                raw_dict = core.database.MySQL.SendQuery("select name, value from locale_en");
           // }
            Dictionary<string, string> final = new Dictionary<string, string>();
            foreach (IDictionary<string, string> d in raw_dict.Values)
            {
                final[d["name"]] = d["value"];
            } 
            return final;
        }
        void Application_PostAuthorizeRequest()
        {
            HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
        }
        void Application_EndRequest(object sender, EventArgs e)
        {
            GC.Collect();
        }
        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {
           if (!(Request.UserHostAddress == "::1" || Request.UserHostAddress.StartsWith("192.168") || Request.UserHostAddress.StartsWith("loalhost") || Request.UserHostAddress != "127.0.0.0"))
            {
                Response.Clear();
                Response.Write("The website is currently unavailable. IP = " + Request.UserHostAddress);
                Response.End();
            }
        }
        /*
        protected void Application_BeginRequest(object sender, EventArgs e)
        {
             
        }
        protected void Session_Start(object sender, EventArgs e)
        {

        } 
        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
        */
    }
}