package com.echo.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String home(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId != null) {
            return "redirect:/dashboard";
        }
        
        return "index";
    }

    @GetMapping("/landing")
    public String landing() {
        return "index";
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        String userId = (String) session.getAttribute("userId");
        String username = (String) session.getAttribute("username");
        
        if (userId == null) {
            return "redirect:/";
        }
        
        model.addAttribute("userId", userId);
        model.addAttribute("username", username);
        
        return "dashboard";
    }
}