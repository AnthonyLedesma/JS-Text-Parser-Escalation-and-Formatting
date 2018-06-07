# JS-Text-Parser---Escalation-and-Formatting
Demo content for account escalations. Intend to pull out only necessary information for quick account information gathering.

Properly pulling default and primary domains, Site ID, Customer Number and formatting in pre-selected template. 

Added ability to add recursive site info to the template.

Added default and primary domain name comparison to help with site check comparison.

Working testing model can now be found on Pact Confluence Home Page.

Still Needed:

-CSS Style

-Extraction of site checks (need demo data) to place within template.

-Reset default settings button for template generator.

-Manual Site Checks should have domain specification. 


Integration Into Confluence - Requirements and Notes
-In Confluence we have the option to import the javascript dependency and link to it directly. (Causes email notifications with updates)
-Alternitively we can embed <script type='text/javascript'> </script> into the HTML macro to include all code on-page.
-Must also strip out document declaration, footer, and header from Git hosted index.html version as these are over-ridden/conflict on Confluence.
-A small section for style appears in both the HTML document and should be embeded within Confluence the same way.
