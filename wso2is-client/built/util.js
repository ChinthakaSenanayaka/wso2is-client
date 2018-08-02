"use strict";
/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.generateNonce = function () {
        var nonceLen = 16;
        return crypto.randomBytes(Math.ceil(nonceLen * 3 / 4))
            .toString('base64') // convert to base64 format
            .slice(0, nonceLen) // return required number of characters
            .replace(/\+/g, '0') // replace '+' with '0'
            .replace(/\//g, '0'); // replace '/' with '0'
    };
    Util.generateState = function () {
        var stateLen = 8;
        return crypto.randomBytes(Math.ceil(stateLen * 3 / 4))
            .toString('base64') // convert to base64 format
            .slice(0, stateLen) // return required number of characters
            .replace(/\+/g, '0') // replace '+' with '0'
            .replace(/\//g, '0'); // replace '/' with '0'
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSCwrQkFBaUM7QUFFakM7SUFBQTtJQWtCQSxDQUFDO0lBakJRLGtCQUFhLEdBQXBCO1FBQ0UsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDakQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFJLDJCQUEyQjthQUNqRCxLQUFLLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFJLHVDQUF1QzthQUM3RCxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFHLHVCQUF1QjthQUM3QyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUUsdUJBQXVCO0lBQ3BELENBQUM7SUFFTSxrQkFBYSxHQUFwQjtRQUNFLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNqQixPQUFPLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2pELFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBSSwyQkFBMkI7YUFDakQsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBSSx1Q0FBdUM7YUFDN0QsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBRyx1QkFBdUI7YUFDN0MsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFFLHVCQUF1QjtJQUNwRCxDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQUFsQkQsSUFrQkM7QUFsQlksb0JBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE4LCBXU08yIEluYy4gKGh0dHA6Ly93d3cud3NvMi5vcmcpIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5cbmV4cG9ydCBjbGFzcyBVdGlsIHtcbiAgc3RhdGljIGdlbmVyYXRlTm9uY2UoKSB7XG4gICAgdmFyIG5vbmNlTGVuID0gMTY7XG4gICAgcmV0dXJuIGNyeXB0by5yYW5kb21CeXRlcyhNYXRoLmNlaWwobm9uY2VMZW4gKiAzIC8gNCkpXG4gICAgICAgIC50b1N0cmluZygnYmFzZTY0JykgICAgLy8gY29udmVydCB0byBiYXNlNjQgZm9ybWF0XG4gICAgICAgIC5zbGljZSgwLCBub25jZUxlbikgICAgLy8gcmV0dXJuIHJlcXVpcmVkIG51bWJlciBvZiBjaGFyYWN0ZXJzXG4gICAgICAgIC5yZXBsYWNlKC9cXCsvZywgJzAnKSAgIC8vIHJlcGxhY2UgJysnIHdpdGggJzAnXG4gICAgICAgIC5yZXBsYWNlKC9cXC8vZywgJzAnKTsgIC8vIHJlcGxhY2UgJy8nIHdpdGggJzAnXG4gIH1cblxuICBzdGF0aWMgZ2VuZXJhdGVTdGF0ZSgpIHtcbiAgICB2YXIgc3RhdGVMZW4gPSA4O1xuICAgIHJldHVybiBjcnlwdG8ucmFuZG9tQnl0ZXMoTWF0aC5jZWlsKHN0YXRlTGVuICogMyAvIDQpKVxuICAgICAgICAudG9TdHJpbmcoJ2Jhc2U2NCcpICAgIC8vIGNvbnZlcnQgdG8gYmFzZTY0IGZvcm1hdFxuICAgICAgICAuc2xpY2UoMCwgc3RhdGVMZW4pICAgIC8vIHJldHVybiByZXF1aXJlZCBudW1iZXIgb2YgY2hhcmFjdGVyc1xuICAgICAgICAucmVwbGFjZSgvXFwrL2csICcwJykgICAvLyByZXBsYWNlICcrJyB3aXRoICcwJ1xuICAgICAgICAucmVwbGFjZSgvXFwvL2csICcwJyk7ICAvLyByZXBsYWNlICcvJyB3aXRoICcwJ1xuICB9XG59Il19