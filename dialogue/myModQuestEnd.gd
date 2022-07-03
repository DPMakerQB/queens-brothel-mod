extends Dialogue
var assets = QB.character.getAssets("Queen") + QB.character.getAssets("Cassie")


func _init().("myModQuestEnd"):
	setBackground("res://assets/Maps/Town/TownBackground.png")
	show("Queen", "left")
	talk("", "Queen walks around town.")
	talk("Queen", "Bubbles! Here kitty kitty!", "Sad")
	talk("", "Cassie walks past Queen with a cat in her arms.")
	talk("Queen", "Hey Cassie! Is that Bubbles?")
	show("Cassie", "right")
	talk("Cassie", "Hey Queen! Yeah, isn't she the cutest!")
	talk("", "Bubbles meows.")
	talk("Queen", "The mayor is looking for her.", "Sad")
	talk("Cassie", "Well, it's not my fault Bubbles likes to hang out with me more than him!")
	talk("Cassie", "Tell him, he knows where to find me!")
	completeQuest("myModQuestEnd")
	message("Congratulations!", "You found Bubbles! The day is saved!")
