!function(root,factory){"function"==typeof define&&define.amd?define(["jquery"],function($){return root.returnExportsGlobal=factory($)}):"object"==typeof exports?module.exports=factory(require("jquery")):factory(jQuery)}(this,function($){/*
  Implement Github like autocomplete mentions
  http://ichord.github.com/At.js

  Copyright (c) 2013 chord.luo@gmail.com
  Licensed under the MIT license.
*/
"use strict";var EditableCaret,InputCaret,Mirror,Utils,discoveryIframeOf,methods,oDocument,oFrame,oWindow,pluginName,setContextBy;pluginName="caret",EditableCaret=function(){function EditableCaret($inputor){this.$inputor=$inputor,this.domInputor=this.$inputor[0]}return EditableCaret.prototype.setPos=function(){return this.domInputor},EditableCaret.prototype.getIEPosition=function(){return this.getPosition()},EditableCaret.prototype.getPosition=function(){var inputor_offset,offset;return offset=this.getOffset(),inputor_offset=this.$inputor.offset(),offset.left-=inputor_offset.left,offset.top-=inputor_offset.top,offset},EditableCaret.prototype.getOldIEPos=function(){var preCaretTextRange,textRange;return textRange=oDocument.selection.createRange(),preCaretTextRange=oDocument.body.createTextRange(),preCaretTextRange.moveToElementText(this.domInputor),preCaretTextRange.setEndPoint("EndToEnd",textRange),preCaretTextRange.text.length},EditableCaret.prototype.getPos=function(){var clonedRange,pos,range;return(range=this.range())?(clonedRange=range.cloneRange(),clonedRange.selectNodeContents(this.domInputor),clonedRange.setEnd(range.endContainer,range.endOffset),pos=clonedRange.toString().length,clonedRange.detach(),pos):oDocument.selection?this.getOldIEPos():void 0},EditableCaret.prototype.getOldIEOffset=function(){var range,rect;return range=oDocument.selection.createRange().duplicate(),range.moveStart("character",-1),rect=range.getBoundingClientRect(),{height:rect.bottom-rect.top,left:rect.left,top:rect.top}},EditableCaret.prototype.getOffset=function(){var clonedRange,offset,range,rect,shadowCaret;return oWindow.getSelection&&(range=this.range())?(range.endOffset-1>0&&range.endContainer===!this.domInputor&&(clonedRange=range.cloneRange(),clonedRange.setStart(range.endContainer,range.endOffset-1),clonedRange.setEnd(range.endContainer,range.endOffset),rect=clonedRange.getBoundingClientRect(),offset={height:rect.height,left:rect.left+rect.width,top:rect.top},clonedRange.detach()),offset&&0!==(null!=offset?offset.height:void 0)||(clonedRange=range.cloneRange(),shadowCaret=$(oDocument.createTextNode("|")),clonedRange.insertNode(shadowCaret[0]),clonedRange.selectNode(shadowCaret[0]),rect=clonedRange.getBoundingClientRect(),offset={height:rect.height,left:rect.left,top:rect.top},shadowCaret.remove(),clonedRange.detach())):oDocument.selection&&(offset=this.getOldIEOffset()),offset&&(offset.top+=$(oWindow).scrollTop(),offset.left+=$(oWindow).scrollLeft()),offset},EditableCaret.prototype.range=function(){var sel;if(oWindow.getSelection)return sel=oWindow.getSelection(),sel.rangeCount>0?sel.getRangeAt(0):null},EditableCaret}(),InputCaret=function(){function InputCaret($inputor){this.$inputor=$inputor,this.domInputor=this.$inputor[0]}return InputCaret.prototype.getIEPos=function(){var endRange,inputor,len,normalizedValue,pos,range,textInputRange;return inputor=this.domInputor,range=oDocument.selection.createRange(),pos=0,range&&range.parentElement()===inputor&&(normalizedValue=inputor.value.replace(/\r\n/g,"\n"),len=normalizedValue.length,textInputRange=inputor.createTextRange(),textInputRange.moveToBookmark(range.getBookmark()),endRange=inputor.createTextRange(),endRange.collapse(!1),pos=textInputRange.compareEndPoints("StartToEnd",endRange)>-1?len:-textInputRange.moveStart("character",-len)),pos},InputCaret.prototype.getPos=function(){return oDocument.selection?this.getIEPos():this.domInputor.selectionStart},InputCaret.prototype.setPos=function(pos){var inputor,range;return inputor=this.domInputor,oDocument.selection?(range=inputor.createTextRange(),range.move("character",pos),range.select()):inputor.setSelectionRange&&inputor.setSelectionRange(pos,pos),inputor},InputCaret.prototype.getIEOffset=function(pos){var h,textRange,x,y;return textRange=this.domInputor.createTextRange(),pos||(pos=this.getPos()),textRange.move("character",pos),x=textRange.boundingLeft,y=textRange.boundingTop,h=textRange.boundingHeight,{left:x,top:y,height:h}},InputCaret.prototype.getOffset=function(pos){var $inputor,offset,position;return $inputor=this.$inputor,oDocument.selection?(offset=this.getIEOffset(pos),offset.top+=$(oWindow).scrollTop()+$inputor.scrollTop(),offset.left+=$(oWindow).scrollLeft()+$inputor.scrollLeft(),offset):(offset=$inputor.offset(),position=this.getPosition(pos),offset={left:offset.left+position.left-$inputor.scrollLeft(),top:offset.top+position.top-$inputor.scrollTop(),height:position.height})},InputCaret.prototype.getPosition=function(pos){var $inputor,at_rect,end_range,format,html,mirror,start_range;return $inputor=this.$inputor,format=function(value){return value=value.replace(/<|>|`|"|&/g,"?").replace(/\r\n|\r|\n/g,"<br/>"),/firefox/i.test(navigator.userAgent)&&(value=value.replace(/\s/g,"&nbsp;")),value},void 0===pos&&(pos=this.getPos()),start_range=$inputor.val().slice(0,pos),end_range=$inputor.val().slice(pos),html="<span style='position: relative; display: inline;'>"+format(start_range)+"</span>",html+="<span id='caret' style='position: relative; display: inline;'>|</span>",html+="<span style='position: relative; display: inline;'>"+format(end_range)+"</span>",mirror=new Mirror($inputor),at_rect=mirror.create(html).rect()},InputCaret.prototype.getIEPosition=function(pos){var h,inputorOffset,offset,x,y;return offset=this.getIEOffset(pos),inputorOffset=this.$inputor.offset(),x=offset.left-inputorOffset.left,y=offset.top-inputorOffset.top,h=offset.height,{left:x,top:y,height:h}},InputCaret}(),Mirror=function(){function Mirror($inputor){this.$inputor=$inputor}return Mirror.prototype.css_attr=["borderBottomWidth","borderLeftWidth","borderRightWidth","borderTopStyle","borderRightStyle","borderBottomStyle","borderLeftStyle","borderTopWidth","boxSizing","fontFamily","fontSize","fontWeight","height","letterSpacing","lineHeight","marginBottom","marginLeft","marginRight","marginTop","outlineWidth","overflow","overflowX","overflowY","paddingBottom","paddingLeft","paddingRight","paddingTop","textAlign","textOverflow","textTransform","whiteSpace","wordBreak","wordWrap"],Mirror.prototype.mirrorCss=function(){var css,_this=this;return css={position:"absolute",left:-9999,top:0,zIndex:-2e4},"TEXTAREA"===this.$inputor.prop("tagName")&&this.css_attr.push("width"),$.each(this.css_attr,function(i,p){return css[p]=_this.$inputor.css(p)}),css},Mirror.prototype.create=function(html){return this.$mirror=$("<div></div>"),this.$mirror.css(this.mirrorCss()),this.$mirror.html(html),this.$inputor.after(this.$mirror),this},Mirror.prototype.rect=function(){var $flag,pos,rect;return $flag=this.$mirror.find("#caret"),pos=$flag.position(),rect={left:pos.left,top:pos.top,height:$flag.height()},this.$mirror.remove(),rect},Mirror}(),Utils={contentEditable:function($inputor){return!(!$inputor[0].contentEditable||"true"!==$inputor[0].contentEditable)}},methods={pos:function(pos){return pos||0===pos?this.setPos(pos):this.getPos()},position:function(pos){return oDocument.selection?this.getIEPosition(pos):this.getPosition(pos)},offset:function(pos){var offset;return offset=this.getOffset(pos)}},oDocument=null,oWindow=null,oFrame=null,setContextBy=function(settings){var iframe;return(iframe=null!=settings?settings.iframe:void 0)?(oFrame=iframe,oWindow=iframe.contentWindow,oDocument=iframe.contentDocument||oWindow.document):(oFrame=void 0,oWindow=window,oDocument=document)},discoveryIframeOf=function($dom){var error;oDocument=$dom[0].ownerDocument,oWindow=oDocument.defaultView||oDocument.parentWindow;try{return oFrame=oWindow.frameElement}catch(_error){error=_error}},$.fn.caret=function(method,value,settings){var caret;return methods[method]?($.isPlainObject(value)?(setContextBy(value),value=void 0):setContextBy(settings),caret=Utils.contentEditable(this)?new EditableCaret(this):new InputCaret(this),methods[method].apply(caret,[value])):$.error("Method "+method+" does not exist on jQuery.caret")},$.fn.caret.EditableCaret=EditableCaret,$.fn.caret.InputCaret=InputCaret,$.fn.caret.Utils=Utils,$.fn.caret.apis=methods});