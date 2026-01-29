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
exports.CategoryManager = void 0;
const vscode = __importStar(require("vscode"));
class CategoryManager {
    context;
    static GLOBAL_STATE_KEY = 'wisdompop_selected_category';
    constructor(context) {
        this.context = context;
    }
    // Show category selection on startup
    async promptCategoryOnStartup() {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        const autoPrompt = config.get('autoPrompt', true);
        if (!autoPrompt) {
            const defaultCategory = config.get('defaultCategory', 'wise');
            return this.setSelectedCategory(defaultCategory);
        }
        return this.showCategorySelection();
    }
    // Show interactive category selection
    async showCategorySelection() {
        const categories = [
            {
                label: '$(lightbulb) Wise & Inspirational',
                description: 'Thoughtful quotes for motivation',
                detail: 'Programming wisdom, life lessons, and inspirational thoughts',
                category: 'wise'
            },
            {
                label: '$(smiley) Fun & Humorous',
                description: 'Lighthearted programming jokes',
                detail: 'Developer humor, funny quotes, and programming jokes',
                category: 'fun'
            },
            {
                label: '$(zap) Stupid & Random',
                description: 'Silly, random, and absurd quotes',
                detail: 'Dumb humor, procrastination quotes, and silly thoughts',
                category: 'stupid'
            },
        ];
        const selection = await vscode.window.showQuickPick(categories, {
            placeHolder: 'Choose your daily wisdom category',
            title: '💭 WisdomPop - Select Your Vibe',
            ignoreFocusOut: true
        });
        if (!selection) {
            return null; // User cancelled
        }
        const category = selection.category;
        await this.setSelectedCategory(category);
        // Show confirmation
        vscode.window.showInformationMessage(`Selected category: ${category.charAt(0).toUpperCase() + category.slice(1)}`, 'Show First Quote').then(choice => {
            if (choice === 'Show First Quote') {
                vscode.commands.executeCommand('dhikr-reminder.showDhikr');
            }
        });
        return category;
    }
    // Get currently selected category
    getSelectedCategory() {
        const config = vscode.workspace.getConfiguration('wisdompop');
        const rememberChoice = config.get('rememberChoice', true);
        if (rememberChoice) {
            const storedCategory = this.context.globalState.get(CategoryManager.GLOBAL_STATE_KEY);
            if (storedCategory) {
                return storedCategory;
            }
        }
        return config.get('defaultCategory', 'wise');
    }
    // Set selected category
    async setSelectedCategory(category) {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        const rememberChoice = config.get('rememberChoice', true);
        if (rememberChoice) {
            await this.context.globalState.update(CategoryManager.GLOBAL_STATE_KEY, category);
        }
        // Update status bar if exists
        this.updateStatusBar(category);
    }
    // Update status bar with current category
    updateStatusBar(category) {
        // This could be implemented if you want a status bar indicator
    }
    // Open settings
    openSettings() {
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:your-publisher.wisdompop');
    }
    // Get category emoji
    getCategoryEmoji(category) {
        switch (category) {
            case 'wise': return '💡';
            case 'fun': return '😂';
            case 'stupid': return '🤪';
            default: return '✨';
        }
    }
    // Get category display name
    getCategoryDisplayName(category) {
        switch (category) {
            case 'wise': return 'Wise & Inspirational';
            case 'fun': return 'Fun & Humorous';
            case 'stupid': return 'Stupid & Random';
            default: return 'Unknown';
        }
    }
}
exports.CategoryManager = CategoryManager;
//# sourceMappingURL=categoryManager.js.map