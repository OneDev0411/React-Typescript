/**
 * In draft-js-emoji-plugin@2.1.2, if you want to customize theme, your classes
 * are not merged with default classes and you need to either use the default
 * theme or provide the whole styles! And defaultTheme is not exported, so
 * there is no normal way for overriding some styles.
 * This seems an ugly and hacky solution but the default theme (with the
 * generated class names) is dumped here and used to prevent the problem
 * described above. Note that in 2.1.3, the default theme is exported but we
 * can't upgrade to it because of it's breaking changes which breaks emoji
 * suggestion list navigation by arrow keys.
 * Another solution would be to use a simple css and add a handful of rules
 * to override what we want, but that way we don't have access to theme
 * variables, and I think this solution keeps the mess isolated and is better!
 */
export const defaultTheme = {
  emoji: 'draftJsEmojiPlugin__emoji__2oqBk',
  emojiSuggestions: 'draftJsEmojiPlugin__emojiSuggestions__2ffcV',
  emojiSuggestionsEntry: 'draftJsEmojiPlugin__emojiSuggestionsEntry__2-2p_',
  emojiSuggestionsEntryFocused:
    'draftJsEmojiPlugin__emojiSuggestionsEntryFocused__XDntY draftJsEmojiPlugin__emojiSuggestionsEntry__2-2p_',
  emojiSuggestionsEntryText:
    'draftJsEmojiPlugin__emojiSuggestionsEntryText__2sPjk',
  emojiSuggestionsEntryIcon:
    'draftJsEmojiPlugin__emojiSuggestionsEntryIcon__1qC2V',
  emojiSelect: 'draftJsEmojiPlugin__emojiSelect__34S1B',
  emojiSelectButton: 'draftJsEmojiPlugin__emojiSelectButton__3sPol',
  emojiSelectButtonPressed:
    'draftJsEmojiPlugin__emojiSelectButtonPressed__2Tezu',
  emojiSelectPopover: 'draftJsEmojiPlugin__emojiSelectPopover__1J1s0',
  emojiSelectPopoverClosed:
    'draftJsEmojiPlugin__emojiSelectPopoverClosed__3Kxxq',
  emojiSelectPopoverTitle: 'draftJsEmojiPlugin__emojiSelectPopoverTitle__3tpXz',
  emojiSelectPopoverGroups:
    'draftJsEmojiPlugin__emojiSelectPopoverGroups__35t9m',
  emojiSelectPopoverGroup: 'draftJsEmojiPlugin__emojiSelectPopoverGroup__3zwcE',
  emojiSelectPopoverGroupTitle:
    'draftJsEmojiPlugin__emojiSelectPopoverGroupTitle__2pC51',
  emojiSelectPopoverGroupList:
    'draftJsEmojiPlugin__emojiSelectPopoverGroupList__HQ8_y',
  emojiSelectPopoverGroupItem:
    'draftJsEmojiPlugin__emojiSelectPopoverGroupItem__2pFOS',
  emojiSelectPopoverToneSelect:
    'draftJsEmojiPlugin__emojiSelectPopoverToneSelect__28bny',
  emojiSelectPopoverToneSelectList:
    'draftJsEmojiPlugin__emojiSelectPopoverToneSelectList__haFSJ',
  emojiSelectPopoverToneSelectItem:
    'draftJsEmojiPlugin__emojiSelectPopoverToneSelectItem__2SgvL',
  emojiSelectPopoverEntry: 'draftJsEmojiPlugin__emojiSelectPopoverEntry__1ErDJ',
  emojiSelectPopoverEntryFocused:
    'draftJsEmojiPlugin__emojiSelectPopoverEntryFocused__M28XS',
  emojiSelectPopoverEntryIcon:
    'draftJsEmojiPlugin__emojiSelectPopoverEntryIcon__1yNaC',
  emojiSelectPopoverNav: 'draftJsEmojiPlugin__emojiSelectPopoverNav__1Nzd7',
  emojiSelectPopoverNavItem:
    'draftJsEmojiPlugin__emojiSelectPopoverNavItem__qydCX',
  emojiSelectPopoverNavEntry:
    'draftJsEmojiPlugin__emojiSelectPopoverNavEntry__1OiGB',
  emojiSelectPopoverNavEntryActive:
    'draftJsEmojiPlugin__emojiSelectPopoverNavEntryActive__2j-Vk',
  emojiSelectPopoverScrollbar:
    'draftJsEmojiPlugin__emojiSelectPopoverScrollbar__1Xjc6',
  emojiSelectPopoverScrollbarThumb:
    'draftJsEmojiPlugin__emojiSelectPopoverScrollbarThumb__jGYdG'
}
