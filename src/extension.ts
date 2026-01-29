import * as vscode from 'vscode';
import { Category, getRandomDhikr } from './adhkar';
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
					showWisdomQuote(selectedCategory, categoryManager);
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
				showWisdomQuote(category, categoryManager);
			}
		}
	);

	// Command to manually show wisdom
	let showWisdomCommand = vscode.commands.registerCommand('dhikr-reminder.showDhikr', () => {
		const category = categoryManager.getSelectedCategory();
      	showWisdomQuote(category, categoryManager);
	});

	// Register command to change category
	let changeCategoryCommand = vscode.commands.registerCommand(
		'dhikr-reminder.changeCategory',
		async () => {
			await categoryManager.showCategorySelection();
		}
	);
	
	// Add commands to subscriptions
	context.subscriptions.push(
		selectCategoryCommand,
		showWisdomCommand,
		changeCategoryCommand
	);
	
	// Schedule periodic quotes based on category
	schedulePeriodicQuotes(categoryManager);

};


function showWisdomQuote(category: Category, categoryManager: CategoryManager) {
  const quote = getRandomDhikr(category);
  const emoji = categoryManager.getCategoryEmoji(category);
  const categoryName = categoryManager.getCategoryDisplayName(category);
  
  // Format the quote for display
  const fullQuote = quote.author 
    ? `${quote.text} — ${quote.author}`
    : quote.text;
};


function schedulePeriodicQuotes(categoryManager: CategoryManager) {
	const config = vscode.workspace.getConfiguration('dhikr-reminder');
	const intervalInMinutes = config.get<number>('intervalInMinutes', 60);
	
	if (intervalInMinutes > 0) {
		setInterval(() => {
			const category = categoryManager.getSelectedCategory();
			showWisdomQuote(category, categoryManager);
		}, intervalInMinutes * 60 * 1000);
	}
};


// This method is called when your extension is deactivated
export function deactivate() {};
