extends Dialogue
var assets = QB.character.getAssets("Queen") + QB.character.getAssets("Mayor")


func _init().("myModQuestStart"):
	setBackground("res://assets/Maps/Town/TownBackground.png")
	show("Queen", "left")
	show("MyCharacter", "right")
	talk("MyCharacter", "Hey Queen, I need your help!")
	talk("Queen", "What's up?")
	talk("Mayor", "My pet cat has run off and I can't find her!", "Sad")
	talk("Mayor", "She's about this big!")
	talk("", "The mayor raises his hands in front of him.")
	talk("Mayor", "And her name is Bubbles!")
	talk("Queen", "Okay, I'll go find her.", "Sad")
	completeQuest("myModQuestStart")
