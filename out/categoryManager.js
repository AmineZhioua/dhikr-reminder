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
    constructor(context) {
        this.context = context;
        //
    }
    // Show category selection on startup
    async promptCategoryOnStartup() {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        const autoPrompt = config.get('autoPrompt', true);
        if (!autoPrompt) {
            const defaultCategory = config.get('defaultCategory', 'Morning Dhikr');
            return this.setSelectedCategory(defaultCategory);
        }
        return this.showCategorySelection();
    }
    // Show interactive category selection
    async showCategorySelection() {
        const categories = [
            {
                label: '$(lightbulb) Morning Dhikr',
                description: 'Adhkar for morning remembrance',
                detail: 'Remembrances and supplications for the morning time (from Fajr until sunrise/noon)',
                category: 'Morning Dhikr'
            },
            {
                label: '$(watch) Evening Dhikr',
                description: 'Adhkar for evening remembrance',
                detail: 'Remembrances and supplications for the evening time (from Asr until Maghrib/until night)',
                category: 'Evening Dhikr'
            },
            {
                label: '$(pray) After Salah',
                description: 'Adhkar after each prayer',
                detail: 'Remembrances and supplications to be recited after the five daily prayers',
                category: 'After Salah'
            },
            {
                label: '$(moon) Before Sleep',
                description: 'Adhkar before sleeping',
                detail: 'Remembrances and supplications to recite before going to bed',
                category: 'Before Sleep'
            },
            {
                label: '$(sun) Waking Up',
                description: 'Adhkar upon waking up',
                detail: 'Remembrances and supplications to recite when waking up from sleep',
                category: 'Waking Up'
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
        return category;
    }
    // Get currently selected category
    getSelectedCategory() {
        const config = vscode.workspace.getConfiguration('wisdompop');
        const rememberChoice = config.get('rememberChoice', true);
        return config.get('defaultCategory', 'Morning Dhikr');
    }
    // Set selected category
    async setSelectedCategory(category) {
        const config = vscode.workspace.getConfiguration('dhikr-reminder');
        const rememberChoice = config.get('rememberChoice', true);
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
}
exports.CategoryManager = CategoryManager;
//# sourceMappingURL=categoryManager.js.map