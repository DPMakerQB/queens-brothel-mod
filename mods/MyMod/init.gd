extends Node
const mod_version = 1.0
const mod_id = "MyMod"
const mod_name = "My Mod"
const mod_description = "A mod I created!"
const author_name = "My Name"
const author_url = "https://queensbrothel.com/"


func _ready():
	# Add our quests into the game.
	QB.quest.addQuest(load("res://quests/myModQuestStart.gd").new())
	QB.quest.addQuest(load("res://quests/myModQuestEnd.gd").new())

	# Add our outfit for Queen into the game.
	QB.character.getCharacter("Queen").addOutfit("MyModOutfit", "My Mod Outfit", "A lovely and totally safe-for-work outfit.", false, "newGame", 100)

	# Add a new character into the game.
	QB.character.addCharacter("res://characters/MyCharacter.gd")
