


var AUX_ARRAY_WIDTH = 25;
var AUX_ARRAY_HEIGHT = 25;
var AUX_ARRAY_START_Y = 50;

var VISITED_START_X = 475;
var PARENT_START_X = 400;

var HIGHLIGHT_CIRCLE_COLOR = "#000000";
var DFS_TREE_COLOR = "#0000FF";
var BFS_QUEUE_HEAD_COLOR = "#0000FF";


var QUEUE_START_X = 30;
var QUEUE_START_Y = 50;
var QUEUE_SPACING = 30;


var D_X_POS_SMALL = [760, 685, 915, 610, 910, 685, 915, 760];
var F_X_POS_SMALL = [760, 685, 915, 610, 910, 685, 915, 760];



var D_Y_POS_SMALL = [18, 118, 118, 218, 218, 318, 318, 418];
var F_Y_POS_SMALL = [32, 132, 132, 232, 232, 332, 332, 432];

var D_X_POS_LARGE = [560, 660, 760, 860,
									610, 710, 810,
									560, 660, 760, 860,
									610, 710, 810,
									560, 660, 760, 860];

var F_X_POS_LARGE = [560, 660, 760, 860,
									610, 710, 810,
									560, 660, 760, 860,
									610, 710, 810,
									560, 660, 760, 860];



var D_Y_POS_LARGE = [037, 037, 037, 037,
									137, 137, 137,
									237, 237, 237, 237, 
									337, 337, 337, 
									437,  437, 437, 437];

var F_Y_POS_LARGE = [62, 62, 62, 62,
									162, 162, 162,
									262, 262, 262, 262, 
									362, 362, 362, 
									462,  462, 462, 462];
var COLOR_CODES = ["#8B008B","#FF8C00","#006400", "#7FFF00","#00FFFF","#00FF00","#FFA500","#000080"];
ELEMENT_WIDTH = 30;
ELEMENT_HEIGHT = 30;
INSERT_X = 30;
INSERT_Y = 200;
STARTING_X = 30;
STARTING_Y = 250;
FOREGROUND_COLOR = "#000055"
BACKGROUND_COLOR = "#AAAAFF"
function BiconnectedComponent(am, w, h)
{
	this.init(am, w, h);
}

BiconnectedComponent.prototype = new Graph();
BiconnectedComponent.prototype.constructor = BiconnectedComponent;
BiconnectedComponent.superclass = Graph.prototype;

BiconnectedComponent.prototype.init = function(am, w, h)
{
	this.showEdgeCosts = false;
	BiconnectedComponent.superclass.init.call(this, am, w, h, false, false); 
	
	this.addControls();
	this.nextIndex = 0;
	this.bccs = [];
	this.pre = {};
	this.low = {};
	this.count = 1;
	this.sepV = [];
	this.parent = {};
	this.stackID = [];
	this.stackValues = [];
	this.stackTop = 0;
	this.nextXPos = STARTING_X;
	this.nextYPos = STARTING_Y;
	this.n = 0;
}
BiconnectedComponent.prototype.setup = function() 
{
	BiconnectedComponent.superclass.setup.call(this);
	this.messageID = new Array();
	this.commands = new Array();
	this.visitedID = new Array(this.size);
	this.visitedIndexID = new Array(this.size);
	this.parentID = new Array(this.size);
	this.parentIndexID = new Array(this.size);
	for (var i = 0; i < this.size; i++)
	{
		this.visitedID[i] = this.nextIndex++;
		this.visitedIndexID[i] = this.nextIndex++;
		this.parentID[i] = this.nextIndex++;
		this.parentIndexID[i] = this.nextIndex++;
		this.cmd("CreateRectangle", this.visitedID[i], "f", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, VISITED_START_X, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		
		this.cmd("CreateLabel", this.visitedIndexID[i], i, VISITED_START_X - AUX_ARRAY_WIDTH , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.visitedIndexID[i], VERTEX_INDEX_COLOR);
		this.cmd("CreateRectangle", this.parentID[i], "", AUX_ARRAY_WIDTH, AUX_ARRAY_HEIGHT, PARENT_START_X, AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		
		this.cmd("CreateLabel", this.parentIndexID[i], i, PARENT_START_X - AUX_ARRAY_WIDTH , AUX_ARRAY_START_Y + i*AUX_ARRAY_HEIGHT);
		this.cmd("SetForegroundColor",  this.parentIndexID[i], VERTEX_INDEX_COLOR);
		
	}
	this.cmd("CreateLabel", this.nextIndex++, "Parent", PARENT_START_X - AUX_ARRAY_WIDTH, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.cmd("CreateLabel", this.nextIndex++, "Visited", VISITED_START_X - AUX_ARRAY_WIDTH, AUX_ARRAY_START_Y - AUX_ARRAY_HEIGHT * 1.5, 0);
	this.animationManager.setAllLayers([0, this.currentLayer]);
	this.animationManager.StartNewAnimation(this.commands);
	this.animationManager.skipForward();
	this.animationManager.clearHistory();
	this.highlightCircleL = this.nextIndex++;
	this.highlightCircleAL = this.nextIndex++;
	this.highlightCircleAM= this.nextIndex++
}
BiconnectedComponent.prototype.pushCallback = function(edge)
{
	var pushedValue = edge;
	if (pushedValue != "")
	{
		this.implementAction(this.push.bind(this), pushedValue);
	}
	
}

BiconnectedComponent.prototype.popCallback = function()
{
	this.implementAction(this.pop.bind(this), "");
}
BiconnectedComponent.prototype.push = function(pushedValue)
{
	this.stackID[this.stackTop] = this.nextIndex++;
	this.cmd("CreateRectangle", this.stackID[this.stackTop], 
			                    pushedValue, 
								ELEMENT_WIDTH,
								ELEMENT_HEIGHT,
								INSERT_X, 
			                    INSERT_Y);
	this.cmd("SetForegroundColor", this.stackID[this.stackTop], FOREGROUND_COLOR);
	this.cmd("SetBackgroundColor", this.stackID[this.stackTop], BACKGROUND_COLOR);
	this.cmd("Step");
	if(this.nextXPos>=350)
	{
		this.nextXPos = STARTING_X;
		this.nextYPos = this.nextYPos + 50;
		this.n=0;
	}
	else
	{
		this.nextXPos = STARTING_X + this.n * ELEMENT_WIDTH;
	}
	this.cmd("Move", this.stackID[this.stackTop], this.nextXPos, this.nextYPos);
	this.cmd("Step"); 
	this.stackTop++;
	this.n++;
}

BiconnectedComponent.prototype.pop = function(unused)
{

	if (this.stackTop > 0)
	{
		this.stackTop--;
		this.n--;
		this.cmd("Move", this.stackID[this.stackTop], INSERT_X, INSERT_Y);
		this.cmd("Step");
		this.cmd("Delete", this.stackID[this.stackTop]);
		this.cmd("Step");
	}
}
BiconnectedComponent.prototype.addControls =  function()
{		
	this.startButton = addControlToAlgorithmBar("Button", "Run Biconnected Component");
	this.startButton.onclick = this.startCallback.bind(this);
	BiconnectedComponent.superclass.addControls.call(this,false);
}	

BiconnectedComponent.prototype.startCallback = function(event)
{
	this.implementAction(this.doBCC.bind(this),"");
}

BiconnectedComponent.prototype.setup_large = function()
{
	
	this.d_x_pos = D_X_POS_LARGE;
	this.d_y_pos = D_Y_POS_LARGE;
	this.f_x_pos = F_X_POS_LARGE;
	this.f_y_pos = F_Y_POS_LARGE;
	
	BiconnectedComponent.superclass.setup_large.call(this); 
}		
BiconnectedComponent.prototype.setup_small = function()
{
	this.d_x_pos = D_X_POS_SMALL;
	this.d_y_pos = D_Y_POS_SMALL;
	this.f_x_pos = F_X_POS_SMALL;
	this.f_y_pos = F_Y_POS_SMALL;

	BiconnectedComponent.superclass.setup_small.call(this); 
}

BiconnectedComponent.prototype.doBCC = function(ignored)
{
	this.visited = new Array(this.size);
	this.commands = new Array();
	this.stackTop = 0;
	this.nextXPos = STARTING_X;
	this.nextYPos = STARTING_Y;
	this.n = 0;
	if (this.messageID != null)
	{
		for (var i = 0; i < this.messageID.length; i++)
		{
			this.cmd("Delete", this.messageID[i]);
		}
	}

	this.rebuildEdges();
	this.messageID = new Array();
	for (i = 0; i < this.size; i++)
	{
		this.cmd("SetText", this.visitedID[i], "f");
		this.cmd("SetText", this.parentID[i], "");
		this.visited[i] = false;
	}
	this.d_timesID_L = new Array(this.size);
	this.f_timesID_L = new Array(this.size);
	this.d_timesID_AL = new Array(this.size);
	this.f_timesID_AL = new Array(this.size);
	this.d_times = new Array(this.size);
	this.f_times = new Array(this.size);
	this.currentTime = 1;
	for (i = 0; i < this.size; i++)
	{
		this.d_timesID_L[i] = this.nextIndex++;
		this.f_timesID_L[i] = this.nextIndex++;
		this.d_timesID_AL[i] = this.nextIndex++;
		this.f_timesID_AL[i] = this.nextIndex++;
	}
	var vertex = 0;
	this.cmd("CreateHighlightCircle", this.highlightCircleL, HIGHLIGHT_CIRCLE_COLOR, this.x_pos_logical[vertex], this.y_pos_logical[vertex]);
	this.cmd("SetLayer", this.highlightCircleL, 1);
	this.cmd("CreateHighlightCircle", this.highlightCircleAL, HIGHLIGHT_CIRCLE_COLOR,this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + vertex*this.adj_list_height);
	this.cmd("SetLayer", this.highlightCircleAL, 2);
	
	this.cmd("CreateHighlightCircle", this.highlightCircleAM, HIGHLIGHT_CIRCLE_COLOR,this.adj_matrix_x_start  - this.adj_matrix_width, this.adj_matrix_y_start + vertex*this.adj_matrix_height);
	this.cmd("SetLayer", this.highlightCircleAM, 3);
	this.messageY = 30;
    for(var i = 0; i < this.size; i++) 
    {
        var node = i;
        this.stack = [];
        if(!this.visited[node]) 
        {
            this.dfs(node, 975);
            if(this.stack.length != 0) 
            {
            	for(i=0; i<this.stack.length; i++)
            	{
            		this.highlightEdge(this.stack[i][0], this.stack[i][1], 1);
            		this.popCallback();
	            }
                this.bccs.push(this.stack);
                this.cmd("Step");
                for(i=0; i<this.stack.length; i++)
            	{
            		this.highlightEdge(this.stack[i][0], this.stack[i][1], 0);
            		
	            }
                this.stack = [];
            }
        }
    }
    
    console.log(this.sepV)
    console.log(this.bccs)
    this.count = 1;
    console.log("doneee");
    for(var i=0; i<this.sepV.length; i++)
    {
    	this.cmd("SetHighlight", this.circleID[this.sepV[i]], 1);
    }
    for(var i=0; i<this.size; i++)
    {
    	this.cmd("SetHighlight", this.visitedID[i], 0);
    }
    this.cmd("Step");
    var k =0;
    for(var i=0; i<this.bccs.length; i++)
    {
    	this.messageY = this.messageY+20;
    	var nextMessage = this.nextIndex++;
		this.messageID.push(nextMessage);
		var label_string = "BCC "+(i+1)+ ":  ";
    	for(var j=0; j<this.bccs[i].length; j++)
    	{
    		label_string += this.bccs[i][j][0] + " ";
    		label_string += this.bccs[i][j][1] + ", ";
    		this.cmd("Disconnect", this.circleID[this.bccs[i][j][0]], this.circleID[this.bccs[i][j][1]]);
			this.cmd("Connect", this.circleID[this.bccs[i][j][0]], this.circleID[this.bccs[i][j][1]], COLOR_CODES[k], this.curve[this.bccs[i][j][0]][this.bccs[i][j][1]], 0, "");
    	}
    	this.cmd("CreateLabel", nextMessage, label_string, 1000, this.messageY, 0);
    	k=k+1;
    	if(k>=8)
    	{
    		k=0;
    	}
    }
    this.cmd("Step");
    this.cmd("Step");
    this.sepV = [];
    this.bccs = [];
	this.cmd("Delete", this.highlightCircleL);
	this.cmd("Delete", this.highlightCircleAL);
	this.cmd("Delete", this.highlightCircleAM);
  

	return this.commands;
}

BiconnectedComponent.prototype.dfs = function(cur, messageX)
{
	var nextMessage = this.nextIndex++;
	this.messageID.push(nextMessage);
	this.cmd("CreateLabel",nextMessage, "DFS(" +  String(cur) +  ")", messageX, this.messageY, 0);
	this.messageY = this.messageY + 20;
	this.visited[cur] = true;
	this.cmd("SetText", this.visitedID[cur], "T");
	this.cmd("Step");
	this.pre[cur] = this.count;
	this.low[cur] = this.count;
	this.messageID.push(this.d_timesID_L[cur]);
	this.messageID.push(this.d_timesID_AL[cur]);
	this.messageID.push(this.f_timesID_L[cur]);
	this.messageID.push(this.f_timesID_AL[cur]);
	this.cmd("CreateLabel", this.d_timesID_L[cur], "pre = " + String(this.pre[cur]), this.d_x_pos[cur], this.d_y_pos[cur]);				
	this.cmd("CreateLabel", this.d_timesID_AL[cur], "pre = " + String(this.pre[cur]), this.adj_list_x_start - 2*this.adj_list_width, this.adj_list_y_start + cur*this.adj_list_height - 1/4*this.adj_list_height);
	this.cmd("SetLayer",  this.d_timesID_L[cur], 1);
	this.cmd("SetLayer",  this.d_timesID_AL[cur], 2);
	this.cmd("CreateLabel", this.f_timesID_L[cur],"low = " + String(this.low[cur]), this.f_x_pos[cur], this.f_y_pos[cur]);
	this.cmd("CreateLabel", this.f_timesID_AL[cur], "low = " + String(this.low[cur]), this.adj_list_x_start - 2*this.adj_list_width, this.adj_list_y_start + cur*this.adj_list_height + 1/4*this.adj_list_height);
	
	this.cmd("SetLayer",  this.f_timesID_L[cur], 1);
	this.cmd("SetLayer",  this.f_timesID_AL[cur], 2);
	
	this.cmd("Step");
	this.count += 1;
	var child = 0;
	for (var neighbor = 0; neighbor < this.size; neighbor++)
	{
		if (this.adj_matrix[cur][neighbor] > 0)
		{
			this.cmd("SetHighlight", this.visitedID[neighbor], 1);
			if(!this.visited[neighbor])
			{
				this.cmd("Disconnect", this.circleID[cur], this.circleID[neighbor]);
				this.cmd("Connect", this.circleID[cur], this.circleID[neighbor], DFS_TREE_COLOR, this.curve[cur][neighbor], 1, "");
				this.cmd("Move", this.highlightCircleL, this.x_pos_logical[neighbor], this.y_pos_logical[neighbor]);
				this.cmd("Move", this.highlightCircleAL, this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + neighbor*this.adj_list_height);
				this.cmd("Move", this.highlightCircleAM, this.adj_matrix_x_start - this.adj_matrix_width, this.adj_matrix_y_start + neighbor*this.adj_matrix_height);
				this.cmd("SetText", this.parentID[neighbor], cur);
				this.parent[neighbor] = cur;
				this.cmd("Step");
	            child += 1;
	            this.stack.push([cur,neighbor]);
	            this.pushCallback(" "+cur+" "+neighbor);
	            this.cmd("Step");
				this.dfs(neighbor, messageX + 20);		
				nextMessage = this.nextIndex;
				this.cmd("CreateLabel", nextMessage, "Returning from recursive call: DFS(" + String(neighbor) + ")", messageX + 20, this.messageY, 0);
				temp = this.low[cur];
	            this.low[cur] = Math.min(this.low[cur],this.low[neighbor]);
	            this.cmd("Move", this.highlightCircleAL, this.adj_list_x_start - this.adj_list_width, this.adj_list_y_start + cur*this.adj_list_height);
				this.cmd("Move", this.highlightCircleL, this.x_pos_logical[cur], this.y_pos_logical[cur]);
				this.cmd("Move", this.highlightCircleAM, this.adj_matrix_x_start - this.adj_matrix_width, this.adj_matrix_y_start + cur*this.adj_matrix_height);
				this.cmd("Step");
				if(temp!=this.low[cur])
				{
					this.cmd("SetHighlight", this.f_timesID_L[cur], 1);
		            this.cmd("setText", this.f_timesID_L[cur],"low = " + String(this.low[cur]));
		        	this.cmd("setText", this.f_timesID_AL[cur], "low = " + String(this.low[cur]));
					this.cmd("Step");
					this.cmd("SetHighlight", this.f_timesID_L[cur], 0);
				}
				this.cmd("Delete", nextMessage);
	            var isRoot = !(cur in this.parent);
				this.cmd("Step");
	            if(((isRoot && child >= 2) || (!isRoot && this.low[neighbor] >= this.pre[cur]))) 
	            {
	                this.sepV.push(cur);
	                console.log("found sv",+cur);
	                nextMessage = this.nextIndex;
					this.cmd("CreateLabel", nextMessage, "Found seperating vertex " + String(cur), messageX + 20, this.messageY, 0);
					this.cmd("SetHighlight", this.circleID[cur], 1);
					this.cmd("Step");
	                temp = [];
	                while(true) 
	                {
	                    var edge = this.stack.pop();
	                    this.popCallback();
	                    this.cmd("Step");
	                    //animate stack
	                    temp.push(edge);
	                    if(edge[0] == cur && edge[1] == neighbor) 
	                    {
	                        break
	                    }
	                }
	                for(i=0; i<temp.length; i++)
	                {
	                	this.highlightEdge(edge[0], edge[1], 1);
	                }
	                this.cmd("Step");
	                this.bccs.push(temp);
	                this.cmd("Delete", nextMessage);
	                this.cmd("SetHighlight", this.circleID[cur], 0);
	                for(i=0; i<temp.length; i++)
	                {
	                	this.highlightEdge(edge[0], edge[1], 0);
	                }
	                this.cmd("Step");
	            }	            
	            
			}
	        else if(this.parent[cur] != neighbor && this.pre[cur] > this.low[neighbor]) 
	        {
	        	nextMessage = this.nextIndex;
				this.cmd("CreateLabel", nextMessage, "Back edge between " + String(cur) + "and " + String(neighbor) , messageX, this.messageY, 0);
				if(this.stack.indexOf([neighbor,cur]) <0) 
	        	{	
					this.stack.push([cur,neighbor]);
					this.cmd("Step");
					this.highlightEdge(cur, neighbor, 1); //highlight back edges
					temp = this.low[cur];
		            this.low[cur] = Math.min(this.low[cur],this.pre[neighbor]);
		            if(temp!=this.low[cur])
					{
						this.cmd("SetHighlight", this.f_timesID_L[cur], 1);
			            this.cmd("setText", this.f_timesID_L[cur],"low = " + String(this.low[cur]));
			        	this.cmd("setText", this.f_timesID_AL[cur], "low = " + String(this.low[cur]));
						this.cmd("Step");
						this.cmd("SetHighlight", this.f_timesID_L[cur], 0);
					}
		            this.cmd("Step");
		            this.cmd("Delete", nextMessage);
		            this.pushCallback(" "+cur+" "+neighbor);
		            this.highlightEdge(cur, neighbor, 0);
	        	}
	            
	        }
			
		}
		
	}
}
BiconnectedComponent.prototype.reset = function()
{

	this.nextIndex = 0;
	this.stackTop = 0;
	

}


BiconnectedComponent.prototype.disableUI = function(event)
{
	this.startButton.disabled = true;
	BiconnectedComponent.superclass.disableUI.call(this, event);
}

BiconnectedComponent.prototype.enableUI = function(event)
{
	
	this.startButton.disabled = false;
	BiconnectedComponent.superclass.enableUI.call(this,event);
}
var currentAlg;
function init()
{
	var animManag = initCanvas();
	currentAlg = new BiconnectedComponent(animManag, canvas.width, canvas.height);
	
}