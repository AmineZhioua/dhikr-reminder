"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const adhkar_1 = require("./adhkar");
const categoryManager_1 = require("./categoryManager");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Initializing managers
    const categoryManager = new categoryManager_1.CategoryManager(context);
    // Show category selection on startup (with delay)
    setTimeout(async () => {
        try {
            const selectedCategory = await categoryManager.showCategorySelection();
            if (selectedCategory) {
                // Show first dhikr after 2 seconds
                setTimeout(() => {
                    showAdhkar(selectedCategory, categoryManager);
                }, 2000);
            }
        }
        catch (error) {
            console.error('Error in category selection:', error);
        }
    }, 3000); // Wait 3 seconds after VS Code starts
    // Register command to show category selection
    let selectCategoryCommand = vscode.commands.registerCommand('dhikr-reminder.selectCategory', async () => {
        const category = await categoryManager.showCategorySelection();
        if (category) {
            showAdhkar(category, categoryManager);
        }
    });
    // Register command to change category
    let changeCategoryCommand = vscode.commands.registerCommand('dhikr-reminder.changeCategory', async () => {
        const category = await categoryManager.showCategorySelection();
        if (category) {
            showAdhkar(category, categoryManager);
        }
    });
    // Add commands to subscriptions
    context.subscriptions.push(selectCategoryCommand, changeCategoryCommand);
}
// Function to Display the Adhkars
function showAdhkar(category, categoryManager, dhikrIndex = 0, counter = 0) {
    const adhkarList = adhkar_1.dhikrCategories[category];
    const currentDhikr = adhkarList[dhikrIndex];
    const targetCount = parseInt(currentDhikr.count);
    // Check if counter reached the goal
    const isComplete = counter >= targetCount;
    const completionEmoji = isComplete ? '✅ ' : '';
    // Format the dhikr for display
    const fullDhikr = `${completionEmoji}${currentDhikr.content}\n\nCount: ${currentDhikr.count} | Counter: ${counter}`;
    // Display the notification toast
    vscode.window.showInformationMessage(fullDhikr, 'Next', 'Increment +', 'Change Adhkar').then(choice => {
        if (choice === 'Next') {
            // Move to next dhikr
            const nextIndex = dhikrIndex + 1;
            // Check if we've completed all dhikr in this category
            if (nextIndex >= adhkarList.length) {
                // Show success message
                vscode.window.showInformationMessage(`🎉 Congratulations! You have completed all ${category}! 🎉`, 'Restart Category', 'Change Category').then(successChoice => {
                    if (successChoice === 'Restart Category') {
                        // Restart from the beginning
                        showAdhkar(category, categoryManager, 0, 0);
                    }
                    else if (successChoice === 'Change Category') {
                        vscode.commands.executeCommand('dhikr-reminder.changeCategory');
                    }
                });
            }
            else {
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
                    vscode.window.showInformationMessage(`🎉 Congratulations! You have completed all ${category}! 🎉`, 'Restart Category', 'Change Category').then(successChoice => {
                        if (successChoice === 'Restart Category') {
                            showAdhkar(category, categoryManager, 0, 0);
                        }
                        else if (successChoice === 'Change Category') {
                            vscode.commands.executeCommand('dhikr-reminder.changeCategory');
                        }
                    });
                }
                else {
                    showAdhkar(category, categoryManager, nextIndex, 0);
                }
            }
            else {
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
function deactivate() { }
//# sourceMappingURL=extension.js.map