# JS-Text-Parser---Escalation-and-Formatting
Demo content for account escalations. Intend to pull out only necessary information for quick account information gathering.


![Template Generator](/screenShot.png?raw=true "Template Generator")



Still Needed:

-Automated SiteChecks with API

-Logging of Events For Issue Tracking.


Integration Into Confluence - Requirements and Notes

-In Confluence we have the option to import the javascript dependency and link to it directly. (Causes email notifications with updates)

-Alternitively we can embed <script type='text/javascript'> </script> into the HTML macro to include all code on-page.

-Must also strip out document declaration, footer, and header from Git hosted index.html version as these are over-ridden/conflict on Confluence.

-Near the top of the index.html file is code to emport UI-Kit stylesheets from CDN. These should be commented out when importing on Confluence.
