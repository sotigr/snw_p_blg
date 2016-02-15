using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Results;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System;
using System.Web;
using System.ServiceModel.Channels;
using System.Net.MySql;
using System.Text;
using System.IO;
using System.Net;
using System.Linq;
using System.Globalization; 
using snw.core.system.javascript;

namespace snw.Controllers
{
    public class mainController : ApiController
    {
   
        [Route("status")]
        [HttpGet]
        public string status()
        {
            return "ok";
        }
        #region Scheduler

        [Route("sc/{var}")]
        [HttpGet]
        public RedirectResult s(string var)
        {
            return Redirect("http://" + core.system.settings.GENERAL.DOMAIN);
        }

        #endregion
        #region Style sheets 
        [Route("style_main")]
        [HttpGet]
        public HttpResponseMessage mainstyle()
        {
            return core.utility.architect.ResponseCSS("main.css");
        }
        [Route("style_lib")]
        [HttpGet]
        public HttpResponseMessage style_lib()
        {
            return core.utility.architect.ResponseCSS("lib.css");
        }
        [Route("cropcss")]
        [HttpGet]
        public HttpResponseMessage cropcss()
        {
            return core.utility.architect.ResponseCSS("cropper.css");
        }
        #endregion


        #region Scripts
        [Route("master_script")]
        [HttpGet]
        public HttpResponseMessage master_script()
        {
            return core.utility.architect.ResponseJs("masterscript.js");
        }
        [Route("script_lib")]
        [HttpGet]
        public HttpResponseMessage script_lib()
        {
            return core.utility.architect.ResponseJs("lib.js");
        }
        #endregion


        #region Pages 
        [Route("")]
        [HttpGet]
        public HttpResponseMessage apiroot()
        {
            return core.utility.architect.ResponseWithMaster("main_master.html", "main.html");
        }
        [Route("profile")]
        [HttpGet]
        public HttpResponseMessage profile()
        {
            return core.utility.architect.ResponseWithMaster("main_master.html", "profile.html", "<testvars></testvars>",
                    PortToJavascript.Parse.VarsToJavaScript(
                        new PortToJavascript.JsConversionParam("testvar", 0),
                        new PortToJavascript.JsConversionParam("testvar2", 23)
                    ));
        }
        [Route("changeimage")]
        [HttpGet]
        public HttpResponseMessage changeimage()
        {
            if (HttpContext.Current.Session["user"] != null)
            {
                return core.utility.architect.ResponseWithMaster("main_master.html", "changeimage.html", "<testvars></testvars>",
                    PortToJavascript.Parse.VarsToJavaScript(
                        new PortToJavascript.JsConversionParam("testvar", 0),
                        new PortToJavascript.JsConversionParam("testvar2", 23)
                    ));
            }
            return core.utility.architect.ResponseNotFound();
        }
        [Route("filemanager")]
        [HttpGet]
        public HttpResponseMessage filemanager()
        {
            if (HttpContext.Current.Session["user"] != null )
            {
                if (((core.system.userallinfo)HttpContext.Current.Session["user"]).sec_clearence > 2)
                {
                    return core.utility.architect.ResponseWithMaster("main_master.html", "filemanager.html");
                }
                return core.utility.architect.ResponseNotFound();
            }
            return core.utility.architect.ResponseNotFound();
        }
        [Route("denied")]
        [HttpGet]
        public HttpResponseMessage denied()
        {
            return core.utility.architect.ResponseForbidden();
        }
        [Route("login")]
        [HttpGet]
        public HttpResponseMessage login()
        { 
            if (HttpContext.Current.Session["user"] == null)
            {
                return core.utility.architect.ResponseWithMaster("main_master.html", "login.html");
            }
            return core.utility.architect.ResponseNotFound();
        }
        [Route("register")]
        [HttpGet]
        public HttpResponseMessage register()
        {
            return core.utility.architect.ResponseWithMaster("main_master.html", "reg.html");
        }
        #endregion


        #region API 
        [Route("locale/{cl_locale}")]
        [HttpGet]
        public Dictionary<string, string> locale(string cl_locale)
        {
            if (core.utility.locale.ContainsKey(cl_locale))
            {
                return core.utility.locale[cl_locale];
            }
            return core.utility.locale["en-US"];
        }

        [Route("api/login")]
        [HttpPost]
        public string api_login(JObject data)
        {
            dynamic ddata = data;
            string nickname, password;
            try
            {
                nickname = ddata.nick;
                password = ddata.pass;
            }
            catch { return "Invalid Data."; }
            if (HttpContext.Current.Session["user"] != null)
            {
                return "User already logged in.";
            }
            if (password == core.database.MySQL.SendQuerySingle("select pass from account_proto where nick = '" + nickname + "';"))
            {
                if (core.database.MySQL.SendQuerySingle("select active from account_proto where nick = '" + nickname + "';") == "0")
                {
                    return "This account is not activated yet.";
                }
                try
                {
                    MysqlResault res = core.database.MySQL.SendQuery("select *, DATE_FORMAT(NOW(),'%d-%m-%Y') AS date from account_proto where nick='" + nickname + "';");
                    core.system.user user = new core.system.userallinfo()
                    {
                        id = int.Parse(res[0]["id"]),
                        nick = res[0]["nick"],
                        pass = res[0]["pass"],
                        email = res[0]["email"],
                        firstname = res[0]["firstname"],
                        lastname = res[0]["lastname"],
                        icon = res[0]["icon"],
                        sec_clearence = int.Parse(res[0]["sec_clearence"]),
                        banned = res[0]["banned"],
                        active = res[0]["active"],
                        creation_date = DateTime.ParseExact(res[0]["date"], "dd-MM-yyyy", null),
                        last_ip = res[0]["last_ip"]
                    };
                    HttpContext.Current.Session["user"] = user;
                    return "1";
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
            else
            {
                return "Wrong username or password.";
            }
        }
        [Route("api/logout")]
        [HttpPost]
        public string api_logout()
        {
            if (HttpContext.Current.Session["user"] != null)
            {
                HttpContext.Current.Session["user"] = null;
                HttpContext.Current.Session.Abandon();
                return "1";
            }
            return "Not logged in";
        }
        [Route("api/changeuserimage")]
        [HttpPost]
        public string api_changeuserimage()
        {
            if (HttpContext.Current.Session["user"] == null)
            {
                return "Permition denied.";
            }
            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                string usericon = core.database.MySQL.SendQuerySingle("select icon from account_proto where id = '" + ((core.system.userallinfo)HttpContext.Current.Session["user"]).id + "';");
                if (usericon != "null") {
                    core.database.MySQL.SendQuery("delete from icon_proto where physical_name = '" + usericon +"';");
                    core.utility.BackupSchedulerCurrent.DeleteFile("users/icons/" + usericon);
                }
                HttpPostedFile img = HttpContext.Current.Request.Files["image"];
                string nameOnly = "";
                using (var reader = new StreamReader(img.InputStream, Encoding.UTF8))
                { 
                    nameOnly = core.utility.ToMD5(((core.system.userallinfo)HttpContext.Current.Session["user"]).nick + reader.ReadToEnd());
                    core.utility.BackupSchedulerCurrent.Write("users/icons/" + nameOnly, core.utility.ResizeImage(core.utility.StreamToBytes(img.InputStream),128,128, System.Drawing.Imaging.ImageFormat.Png), true);
                }
                core.database.MySQL.SendQuery("insert into icon_proto values(NULL, '" + nameOnly + "', '" + ((core.system.userallinfo)HttpContext.Current.Session["user"]).id + "');"+
                    "update account_proto set icon='"+nameOnly+"' where id = '"+ ((core.system.userallinfo)HttpContext.Current.Session["user"]).id + "';");

                return "1";
            }
            else
            {
                return "No data.";
            }
        }
        [Route("api/getuserimage")]
        [HttpGet]
        public HttpResponseMessage api_getuserimage()
        {
            try
            {
                string usericon = core.database.MySQL.SendQuerySingle("select icon from account_proto where id = '" + ((core.system.userallinfo)HttpContext.Current.Session["user"]).id + "';");
                if (usericon == "null")
                {
                    return core.utility.architect.ResponseNotFound();
                }
                MemoryStream ms = new MemoryStream(core.utility.BackupSchedulerCurrent.ReadBytes("users/icons/" + usericon));
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new StreamContent(ms);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/png");
                return response;
            }
            catch
            {
                return core.utility.architect.ResponseNotFound();
            }
        }
        [Route("api/userdata")]
        [HttpGet]
        public IDictionary<string, string> api_userdata()
        {
            if (HttpContext.Current.Session["user"] != null)
            {
                return core.database.MySQL.SendQuery("select nick, email, firstname, lastname, icon, sec_clearence, DATE_FORMAT(creation_date,'%d/%m/%Y') AS date from account_proto where nick='" + ((core.system.user)HttpContext.Current.Session["user"]).nick + "';")[0];
            }
            return null;
        }
        [Route("api/register")]
        [HttpPost]
        public string api_register(JObject data)
        {
            return "Registration closed!";
            dynamic ddata = data;
            string nickname, password, email;
            try
            {
                nickname = ddata.nickname;
                password = ddata.password;
                email = ddata.email;
            }
            catch
            {
                return "Invalid Data.";
            }

            if (core.utility.RegularMatch(@"^[\w!#$%&'*+\-/=?\^_`{|}~]+(\.[\w!#$%&'*+\-/=?\^_`{|}~]+)*" + "@" + @"((([\-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))$", email))
            {
                if (password != "" || !password.Contains(" "))
                {
                    if (nickname.Trim() != "" || nickname.Length > 3)
                    {
                        if (core.database.MySQL.SendQuerySingle("select id from account_proto where nick = '" + nickname + "';").Trim() == "")
                        {
                            core.database.MySQL.SendQuerySingle("insert into account_proto values(NULL, '" + nickname + "', '" + password + "','" + email + "',NULL,NULL,NULL,0,false,false,'" + DateTime.Now.ToString("yyyy-MM-dd") + "','" + GetClientIp() + "')");
                            return "1";
                        }
                        else
                        {
                            return "Account already exists.";
                        }
                    }
                    else
                    {
                        return "Nickname is not valid. The nickname must be at least 4 characters long.";
                    }
                }
                else
                {
                    return "The password is not valid";
                }
            }
            else
            {
                return "The email is not valid.";
            }
        }


        private string GetClientIp(HttpRequestMessage request = null)
        {
            request = request ?? Request;

            if (request.Properties.ContainsKey("MS_HttpContext"))
            {
                return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
            }
            else if (request.Properties.ContainsKey(RemoteEndpointMessageProperty.Name))
            {
                RemoteEndpointMessageProperty prop = (RemoteEndpointMessageProperty)request.Properties[RemoteEndpointMessageProperty.Name];
                return prop.Address;
            }
            else if (HttpContext.Current != null)
            {
                return HttpContext.Current.Request.UserHostAddress;
            }
            else
            {
                return null;
            }
        }
        #endregion
        #region tools
        [Route("api/image/upload")]
        [HttpPost]
        public string api_image_upload()
        {
            try
            {
                if (HttpContext.Current.Session["user"] != null && ((core.system.userallinfo)HttpContext.Current.Session["user"]).sec_clearence >= 3)
                {
                    if (HttpContext.Current.Request.Files.AllKeys.Any())
                    {
                        HttpPostedFile img = HttpContext.Current.Request.Files["image"];
                        string nameOnly = "";
                        using (var reader = new System.IO.StreamReader(img.InputStream, Encoding.UTF8))
                        {
                            nameOnly = core.utility.ToMD5(((core.system.userallinfo)HttpContext.Current.Session["user"]).nick + reader.ReadToEnd());
                            core.utility.BackupSchedulerCurrent.Write("images/" + nameOnly, core.utility.StreamToBytes(img.InputStream), true);
                        }
                        core.database.MySQL.SendQuery("insert into image_proto values(NULL, '" + nameOnly + "', '" + ((core.system.userallinfo)HttpContext.Current.Session["user"]).id + "');");

                        return nameOnly;
                    }
                    else
                    {
                        return "No Data!";
                    }
                }
                else
                {
                    return "You do not have permition to upload.";
                }
            }
            catch (Exception ex)
            {
                return ex.Source;
            }
        }
        [Route("api/image/{imagename}")]
        [HttpGet]
        public HttpResponseMessage api_image(string imagename)
        {
            try
            {
                MemoryStream ms = new MemoryStream(core.utility.BackupSchedulerCurrent.ReadBytes("images/" + imagename));
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new StreamContent(ms);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpg");
                return response;
            }
            catch
            {
                return core.utility.architect.ResponseNotFound();
            }
        }
        [Route("api/imagebyid/{imageid}")]
        [HttpGet]
        public HttpResponseMessage api_imagebyid(string imageid)
        {
            try
            {
                string imagename = core.database.MySQL.SendQuerySingle("select physical_name from image_proto where id = '" + imageid + "';");
                MemoryStream ms = new MemoryStream(core.utility.BackupSchedulerCurrent.ReadBytes("images/" + imagename));
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                response.Content = new StreamContent(ms);
                response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/jpg");
                return response;
            }
            catch
            {
                return core.utility.architect.ResponseNotFound();
            }
        }
        #endregion
    }
}