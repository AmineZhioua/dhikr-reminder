import * as vscode from 'vscode';
import { Category, getRandomDhikr, wisdomCategories } from './adhkar';
import { CategoryManager } from './categoryManager';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Initializing managers
  	const categoryManager = new CategoryManager(context);

	// Show category selection on startup (with delay)
	setTimeout(async () => {
		try {
			const selectedCategory = await categoryManager.promptCategoryOnStartup();
			
			if (selectedCategory) {
				// Show first quote after 2 seconds
				setTimeout(() => {
					showAdhkar(selectedCategory, categoryManager);
				}, 2000);
			}
		} catch (error) {
			console.error('Error in category selection:', error);
		}
	}, 3000); // Wait 3 seconds after VS Code starts

	// Register command to show category selection
	let selectCategoryCommand = vscode.commands.registerCommand(
		'dhikr-reminder.selectCategory',
		async () => {
			const category = await categoryManager.showCategorySelection();
			if (category) {
				showAdhkar(category, categoryManager);
			}
		}
	);

	// Command to manually show wisdom
	let showWisdomCommand = vscode.commands.registerCommand('dhikr-reminder.showDhikr', () => {
		const category = categoryManager.getSelectedCategory();
      	showAdhkar(category, categoryManager);
	});

	// Register command to change category
	let changeCategoryCommand = vscode.commands.registerCommand(
		'dhikr-reminder.changeCategory',
		async () => {
			const category = await categoryManager.showCategorySelection();
			if (category) {
				showAdhkar(category, categoryManager);
			}
		}
	);
	
	// Add commands to subscriptions
	context.subscriptions.push(
		selectCategoryCommand,
		showWisdomCommand,
		changeCategoryCommand
	);
}

function showAdhkar(
	category: Category, 
	categoryManager: CategoryManager, 
	dhikrIndex: number = 0, 
	counter: number = 0
) {
	const adhkarList = wisdomCategories[category];
	const currentDhikr = adhkarList[dhikrIndex];
	const targetCount = parseInt(currentDhikr.count);
	
	// Check if counter reached the goal
	const isComplete = counter >= targetCount;
	const completionEmoji = isComplete ? '✅ ' : '';
	
	// Format the dhikr for display
	const fullDhikr = `${completionEmoji}${currentDhikr.content}\n\nCount: ${currentDhikr.count} | Counter: ${counter}`;
	
	// Add description if available
	const displayMessage = currentDhikr.description 
		? `${fullDhikr}\n\n📝 ${currentDhikr.description}`
		: fullDhikr;
	
	// Display the notification toast
	vscode.window.showInformationMessage(
		displayMessage,
		'Next',
		'Increment +',
		'Change Adhkar'
	).then(choice => {
		if (choice === 'Next') {
			// Move to next dhikr
			const nextIndex = dhikrIndex + 1;
			
			// Check if we've completed all dhikr in this category
			if (nextIndex >= adhkarList.length) {
				// Show success message
				vscode.window.showInformationMessage(
					`🎉 Congratulations! You have completed all ${category}! 🎉`,
					'Restart Category',
					'Change Category'
				).then(successChoice => {
					if (successChoice === 'Restart Category') {
						// Restart from the beginning
						showAdhkar(category, categoryManager, 0, 0);
					} else if (successChoice === 'Change Category') {
						vscode.commands.executeCommand('dhikr-reminder.changeCategory');
					}
				});
			} else {
				// Show next dhikr with counter reset
				showAdhkar(category, categoryManager, nextIndex, 0);
			}
		} 
		else if (choice === 'Increment +') {
			// Check if current dhikr is complete
			if (counter >= targetCount) {
				// Auto-advance to next dhikr
				const nextIndex = dhikrIndex + 1;
				
				if (nextIndex >= adhkarList.length) {
					// Show success message
					vscode.window.showInformationMessage(
						`🎉 Congratulations! You have completed all ${category}! 🎉`,
						'Restart Category',
						'Change Category'
					).then(successChoice => {
						if (successChoice === 'Restart Category') {
							showAdhkar(category, categoryManager, 0, 0);
						} else if (successChoice === 'Change Category') {
							vscode.commands.executeCommand('dhikr-reminder.changeCategory');
						}
					});
				} else {
					showAdhkar(category, categoryManager, nextIndex, 0);
				}
			} else {
				// Increment counter for current dhikr
				showAdhkar(category, categoryManager, dhikrIndex, counter + 1);
			}
		} 
		else if (choice === 'Change Adhkar') {
			// Open category selection
			vscode.commands.executeCommand('dhikr-reminder.changeCategory');
		}
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}