# JS-Text-Parser---Escalation-and-Formatting
Demo content for account escalations. Intend to pull out only necessary information for quick account information gathering.

JS File does not have real API URL for slack.


![Template Generator](/screenShot.png?raw=true "Template Generator")


### Version 1.1 for **JS Text Parser** AKA **Escalation Template - Issue Tracker**

### Features:
+ Automated SiteChecks With Text Parser.
+ Integrated Issue Tracker With Slack.
+ Content Checking Logic, Preventing Spam.
+ Error In Results Box Will Indicate Missing Content.

### Change Log:
#### 1.1
+ Form content error reporting. 
+ IIFE is housing all code now.
+ Minimum Global Name Space pollution.
+ 'Strict Mode' in use.



### Integration Into Confluence - Requirements and Notes
+ In Confluence we have the option to import the javascript dependency and link to it directly. (Causes email notifications with updates)
+ Alternitively we can embed <script type='text/javascript'> </script> into the HTML macro to include all code on-page.
+ Must also strip out document declaration, footer, and header from Git hosted index.html version as these are over-ridden/conflict on Confluence.
+ Near the top of the index.html file is code to emport UI-Kit stylesheets from CDN. These should be commented out when importing on Confluence.



**What new features does this tool need? Let me know!**
