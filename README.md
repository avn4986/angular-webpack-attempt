# Configuration 
<pre>
{
  "path_prefix": "ps",<b>--URL Path Prefix</b>
  "title": "Power Services Chatbot", <b>--Title for the chatbot window</b>
  "enable_bot_school": false, <b>--Whether to enable Bot School, this module enables the user to suggest questions. </b>
  "bot_school": {
    <b>--If bot school is enabled, then the following messages will be displayed. </b>
    "bot_messages": [
      {
        "message": "Power Services is an extensive support platform where our engineers work our best to solve your technical problems in the quickest and the best way possible.",
        "classes": [
          "text--bold",
          "text--italic"
        ]
      },
      {
        "message": "Based on above definition, kindly type in whatever questions you would like to ask in the box below. Thank you !",
        "classes": []
      }
    ]
  }
}

</pre>
