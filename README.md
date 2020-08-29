## How to install:

[Setup Video](https://imgur.com/a/SNRc7hJ)

Click code, download zip

Unzip the file by right clicking it and selecting extract

Go to chrome in the address bar type chrome://extensions/

Switch on dev mode

Load Unpacked

Naviagte to the folder you unzipped the extension to, select the folder, click open

Go to yahoo fantasy mock drafts and join a team

After the draft starts there will be a puzzle icon in the top right near your chrome address bar, click it

select chrome extension called Yahoo Fantasy Football

click setting and type in the name of your CSV file (has to be in the unzipped directory/ffbcext/rankings) do not include .csv

click save, then hit refresh

it will load the available players in the category selected (so if RBs are selected on yahoo you will only see your RB rankings)

## Rankings List
Rankings CSVs should be placed into the rankings folder

In Google Drive I'm going to do all my notes and editing
  The program finds the player name.  It assumes next is the Team, then position, then notes (if long text is founde)

The program looks for a player name (longer than 8 characters) then compares those names to Yahoo's list.  This will get tripped up by weird spacing or capitalization

The program will look for the player name, then the next column is assumed to be a team, the next position

Defenses should be named by the city 

## Work Around
To keep the popup open while clicking on Yahoo, right click the extension window and click inspect.  As long as the inspection window is open it will not disapear

notes at the end of player CSV row causing the next player to not sure up, I have been creating a new CSV with out my notes

## Todo:

Compare players loaded to Yahoo table length

make sorting for pos (currently is handled by yahoo)

I kind of want the ADP of some sort from CR or fantasy pros (maybe use stylesheet to just number the RBs in Google Drive)

stop popup from disapearing when clicking off app?

add custom notes from csv?  

maybe stop errors from coming up when site is not loaded