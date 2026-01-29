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
            const selectedCategory = await categoryManager.promptCategoryOnStartup();
            if (selectedCategory) {
                // Show first quote after 2 seconds
                setTimeout(() => {
                    showWisdomQuote(selectedCategory, categoryManager);
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
            showWisdomQuote(category, categoryManager);
        }
    });
    // Command to manually show wisdom
    let showWisdomCommand = vscode.commands.registerCommand('dhikr-reminder.showDhikr', () => {
        const category = categoryManager.getSelectedCategory();
        showWisdomQuote(category, categoryManager);
    });
    // Register command to change category
    let changeCategoryCommand = vscode.commands.registerCommand('dhikr-reminder.changeCategory', async () => {
        await categoryManager.showCategorySelection();
    });
    // Add commands to subscriptions
    context.subscriptions.push(selectCategoryCommand, showWisdomCommand, changeCategoryCommand);
    // Schedule periodic quotes based on category
    schedulePeriodicQuotes(categoryManager);
}
;
function showWisdomQuote(category, categoryManager) {
    const quote = (0, adhkar_1.getRandomDhikr)(category);
    const emoji = categoryManager.getCategoryEmoji(category);
    const categoryName = categoryManager.getCategoryDisplayName(category);
    // Format the quote for display
    const fullQuote = quote.author
        ? `${quote.text} — ${quote.author}`
        : quote.text;
}
;
function schedulePeriodicQuotes(categoryManager) {
    const config = vscode.workspace.getConfiguration('dhikr-reminder');
    const intervalInMinutes = config.get('intervalInMinutes', 60);
    if (intervalInMinutes > 0) {
        setInterval(() => {
            const category = categoryManager.getSelectedCategory();
            showWisdomQuote(category, categoryManager);
        }, intervalInMinutes * 60 * 1000);
    }
}
;
// This method is called when your extension is deactivated
function deactivate() { }
;
//# sourceMappingURL=extension.js.map