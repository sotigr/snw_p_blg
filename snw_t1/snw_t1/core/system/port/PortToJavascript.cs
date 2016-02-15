
namespace snw.core.system.javascript
{
    public class PortToJavascript
    {
        public class Parse
        {
            public static string VarsToJavaScript(params JsConversionParam[] Oparams)
            {
                string fn = "<script>";
                foreach (JsConversionParam obj in Oparams)
                {
                    fn += "var " + obj.Name + "='" + obj.Value.ToString() + "';";
                }
                fn += "</script>";
                return fn;
            }
        }
        public class JsConversionParam
        {
            public JsConversionParam() { }
            public JsConversionParam(string name, object value)
            {
                Name = name;
                Value = value;
            }
            public string Name { set; get; }
            public object Value { set; get; }
            public bool Serialize { set; get; }
        }
    }
}